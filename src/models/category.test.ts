import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Category, CategoryModel } from '../models/category';

describe('Category Model Test', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: "verifyMASTER" });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('Create & save category successfully', async () => {
    const categoryData: Category = { name: 'sofas', slug: 'sofas', urlImage: 'http://example.com/sofas.png', order: 0 };
    const validCategory = new CategoryModel(categoryData);
    const savedCategory = await validCategory.save();

    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.name).toBe(categoryData.name);
    expect(savedCategory.slug).toBe(categoryData.slug);
    expect(savedCategory.urlImage).toBe(categoryData.urlImage);
  });
});