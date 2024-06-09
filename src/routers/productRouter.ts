import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { ProductModel } from "../models/product";
import { CategoryModel } from "../models/category";
import { StockModel } from "../models/stock";
import { isAuth, isAdmin } from "../utils";
import { Types, PipelineStage } from "mongoose";

const productRouter = express.Router();

productRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductModel.aggregate([
      {
        $lookup: {
          from: "stock",
          localField: "_id",
          foreignField: "product",
          as: "stockInfo",
        },
      },
      {
        $addFields: {
          inStock: { $gt: [{ $arrayElemAt: ["$stockInfo.quantity", 0] }, 0] },
        },
      },
      {
        $sort: {
          priority: -1,
          inStock: -1,
          "stockInfo.quantity": 1,
        },
      },
      {
        $project: {
          stockInfo: 0,
        },
      },
    ]).exec();
    res.json(products);
  })
);

const validateSlugFormat = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { slug } = req.params;

  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  if (!regex.test(slug)) {
    res.status(400).json({ message: "Invalid slug format" });
    return;
  }

  next();
};

productRouter.get(
  "/slug/:slug",
  validateSlugFormat,
  asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductModel.findOne({ slug: req.params.slug });
    product
      ? res.json(product)
      : res.status(404).json({ message: "Product not found" });
  })
);

productRouter.get(
  "/id/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const product = await ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.json(product);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching product by ID" });
    }
  })
);

productRouter.get(
  "/similar/:categoryId/:productId",
  async (req: Request, res: Response) => {
    const { categoryId, productId } = req.params;
    try {
      const products = await ProductModel.aggregate([
        {
          $match: {
            "category._id": new Types.ObjectId(categoryId),
            _id: { $ne: new Types.ObjectId(productId) },
          },
        },
        { $limit: 6 },
      ]).exec();

      res.json(products);
    } catch (error) {
      console.error("Fetch Error:", error);
      res.status(500).json({ message: "Error fetching similar products" });
    }
  }
);

productRouter.get(
  "/search",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      searchText,
      categories,
      inStock,
      materials,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const inStockBool = inStock !== undefined && inStock !== "false";
    const minPriceNumber = minPrice ? Number(minPrice) : undefined;
    const maxPriceNumber = maxPrice ? Number(maxPrice) : undefined;

    let productIdsInStockObjectIds: Types.ObjectId[] = [];
    if (inStockBool) {
      const stockInfo = await StockModel.find({ quantity: { $gt: 0 } }).exec();
      const productIdsInStock = stockInfo.map((stock) =>
        stock.product._id.toString()
      );
      productIdsInStockObjectIds = productIdsInStock.map(
        (id) => new Types.ObjectId(id)
      );
    }

    let categoryIds: string[] = [];
    if (categories) {
      const categorySlugs =
        typeof categories === "string" ? categories.split(",") : [];
      const categoryDocs = await CategoryModel.find({
        slug: { $in: categorySlugs },
      });
      categoryIds = categoryDocs.map((doc) => doc._id);
    }

    const searchStage: PipelineStage = searchText
      ? {
          $search: {
            index: "searchIndex",
            compound: {
              should: [
                {
                  text: {
                    query: searchText,
                    path: ["name", "description", "materials"],
                    score: { boost: { value: 4 } },
                  },
                },
                {
                  text: {
                    query: searchText,
                    path: ["name", "description", "materials"],
                    fuzzy: {
                      maxEdits: 1,
                      prefixLength: 0,
                    },
                    score: { boost: { value: 3 } },
                  },
                },
                {
                  text: {
                    query: searchText,
                    path: ["name", "description", "materials"],
                    fuzzy: {
                      maxEdits: 2,
                      prefixLength: 3,
                    },
                    score: { boost: { value: 1 } },
                  },
                },
              ],
            },
          },
        }
      : { $match: {} };

    const lookupStage = {
      $lookup: {
        from: "stock",
        localField: "_id",
        foreignField: "product._id",
        as: "stockInfo",
      },
    };

    const matchStage: PipelineStage = {
      $match: {
        ...(minPriceNumber !== undefined &&
          maxPriceNumber !== undefined && {
            price: { $gte: minPriceNumber, $lte: maxPriceNumber },
          }),
        ...(minPriceNumber !== undefined &&
          maxPriceNumber === undefined && {
            price: { $gte: minPriceNumber },
          }),
        ...(minPriceNumber === undefined &&
          maxPriceNumber !== undefined && {
            price: { $lte: maxPriceNumber },
          }),
        ...(categories && { "category._id": { $in: categoryIds } }),
        ...(inStockBool && { _id: { $in: productIdsInStockObjectIds } }),
        ...(materials && {
          materials: {
            $in:
              typeof materials === "string" ? materials.split(",") : materials,
          },
        }),
      },
    };

    const sortStage: PipelineStage = {
      $sort: {
        ...(sortBy === "price"
          ? {
              price: sortOrder === "asc" ? 1 : -1,
            }
          : {}),
        ...(sortBy === "createdAt"
          ? {
              createdAt: sortOrder === "asc" ? 1 : -1,
            }
          : {}),
        ...(!sortBy || (sortBy !== "price" && sortBy !== "createdAt")
          ? {
              priority: -1,
              inStock: -1,
            }
          : {}),
      },
    };

    const addFieldsStage = {
      $addFields: {
        inStock: { $gt: [{ $arrayElemAt: ["$stockInfo.quantity", 0] }, 0] },
      },
    };

    const pipeline: PipelineStage[] = [
      ...(Object.keys(searchStage).length > 0 ? [searchStage] : []),
      lookupStage,
      addFieldsStage,
      matchStage,
      sortStage,
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          description: 1,
          price: 1,
          URLimages: 1,
          quantity: { $arrayElemAt: ["$stockInfo.quantity", 0] },
          inStock: 1,
          priority: 1,
          category: 1,
        },
      },
    ];

    const results = await ProductModel.aggregate(pipeline).exec();
    const totalResults = await ProductModel.countDocuments(matchStage.$match);
    res.json({ results, totalResults });
  })
);

productRouter.post(
  "/",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const {
        name,
        slug,
        URLimages,
        categoryId,
        description,
        materials,
        price,
        priority,
        _id,
      } = req.body;
      const category = await CategoryModel.findById(categoryId);
      if (!category) {
        res.status(500).json("Category does not exist");
        return;
      }

      const newProduct = new ProductModel({
        _id,
        name,
        slug,
        URLimages,
        category: category,
        description,
        materials,
        price,
        priority,
      });
      const savedProduct = await newProduct.save();

      const newStock = new StockModel({
        product: savedProduct,
        quantity: 0,
      });
      await newStock.save();

      res.status(201).json({ product: savedProduct, stock: newStock });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error on product creation" });
    }
  })
);

productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const deletionFilter = { _id: new Types.ObjectId(id) };
    try {
      const productDeletionResult = await ProductModel.deleteOne(
        deletionFilter
      );
      if (productDeletionResult.deletedCount > 0) {
        const stockDeletionResult = await StockModel.deleteOne({
          "product._id": id,
        });
        if (stockDeletionResult.deletedCount > 0) {
          res.json({
            message: "Product and associated stock deleted successfully.",
          });
        } else {
          res.json({
            message:
              "Product deleted successfully, but no associated stock was found.",
          });
        }
      } else {
        res.status(404).json({ error: "Product not found." });
      }
    } catch (error) {
      console.error("Error :", error);
      res.status(500).json({ error: "Delete error." });
    }
  })
);

productRouter.put(
  "/:productId",
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    const newData = req.body;
    try {
      const result = await ProductModel.updateOne(
        { _id: productId },
        { $set: newData }
      );
      if (result.matchedCount === 0) {
        res.status(500).json({ error: "No product found" });
      } else if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update succeeded" });
      } else {
        res.status(500).json({ error: "Update error" });
      }
    } catch (error) {
      console.error("error :", error);
      next(error);
    }
  })
);

export { productRouter };
