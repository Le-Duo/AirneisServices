import { DocumentType } from "@typegoose/typegoose";
import { CarouselItem } from "./models/carouselItem";
import { Category } from "./models/category";
import { Contact } from "./models/contact";
import { Order, ShippingAddress, OrderStatus } from "./models/order";
import { Product } from "./models/product";
import { Stock } from "./models/stock";
import { User } from "./models/user";
import bcrypt from "bcryptjs";

export const sampleCategories: Category[] = [
  {
    _id: "60d0fe4f5311236168a109ca",
    name: "Sofas",
    urlImage: "https://airneisstaticassets.onrender.com/images/categorysofa.png",
    slug: "sofas",
    description:
      "Discover the ultimate comfort with our luxurious sofa collection, perfect for elevating your living space.",
    order: 0,
  },
  {
    _id: "60d0fe4f5311236168a109cb",
    name: "Tables",
    urlImage: "https://airneisstaticassets.onrender.com/images/categorytable.png",
    slug: "tables",
    description:
      "Elevate your dining experience with our stylish and functional tables, designed to fit any space.",
    order: 1,
  },
  {
    _id: "60d0fe4f5311236168a109cc",
    name: "Bookcases",
    urlImage: "https://airneisstaticassets.onrender.com/images/categorybookcase.png",
    slug: "bookcases",
    description:
      "Organize your favorite reads and accentuate your space with our elegant and versatile bookcases.",
    order: 2,
  },
  {
    _id: "60d0fe4f5311236168a109cd",
    name: "Rugs",
    urlImage: "https://airneisstaticassets.onrender.com/images/categoryrug.png",
    slug: "rugs",
    description:
      "Add a touch of warmth and style to any room with our exquisite collection of rugs.",
    order: 3,
  },
  {
    _id: "60d0fe4f5311236168a109ce",
    name: "Lamps",
    urlImage: "https://airneisstaticassets.onrender.com/images/categorylamp.png",
    slug: "lamps",
    description:
      "Illuminate your home with our range of beautiful and functional lamps, perfect for setting the mood.",
    order: 4,
  },
  {
    _id: "60d0fe4f5311236168a109cf",
    name: "Wardrobes",
    urlImage: "https://airneisstaticassets.onrender.com/images/categorywardrobe.png",
    slug: "wardrobes",
    description:
      "Keep your clothes organized and your bedroom tidy with our stylish and spacious wardrobes.",
    order: 5,
  },
];

export const sampleProducts: Product[] = [
  {
    _id: "60d0fe4f5311236168a109d0",
    name: "MACLEOD",
    slug: "macleod",
    URLimages: ["https://airneisstaticassets.onrender.com/images/blue-3-seater-sofa.png"],
    category: sampleCategories.find(
      (cat) => cat.slug === "sofas"
    ) as DocumentType<Category>,
    materials: ["cotton", "wood"],
    price: 200,
    description: "Blue 3-seater sofa",
    priority: true,
  },
  {
    _id: "60d0fe4f5311236168a109d1",
    name: "NESSIE",
    slug: "nessie",
    URLimages: ["https://airneisstaticassets.onrender.com/images/red-2-seater-sofa-in-living-room.png"],
    category: sampleCategories.find(
      (cat) => cat.slug === "sofas"
    ) as DocumentType<Category>,
    materials: ["cotton", "wood"],
    price: 150,
    description: "Red 2-seater sofa",
    priority: false,
  },
  {
    _id: "60d0fe4f5311236168a109d2",
    name: "THISTLE",
    slug: "thistle",
    URLimages: ["https://airneisstaticassets.onrender.com/images/single-seat-green-sofa-in-living-room.png"],
    category: sampleCategories.find(
      (cat) => cat.slug === "sofas"
    ) as DocumentType<Category>,
    materials: ["cotton", "wood"],
    price: 100,
    description: "Green 1-seater sofa",
    priority: false,
  },
  {
    _id: "60d0fe4f5311236168a109d3",
    name: "GLEN",
    slug: "glen",
    URLimages: ["https://airneisstaticassets.onrender.com/images/modern-brown-coffee-table (1).png"],
    category: sampleCategories.find(
      (cat) => cat.slug === "tables"
    ) as DocumentType<Category>,
    materials: ["wood"],
    price: 80,
    description: "Brown coffee table",
    priority: false,
  },
  {
    _id: "60d0fe4f5311236168a109d4",
    name: "WALLACE",
    slug: "wallace",
    URLimages: [
      "https://airneisstaticassets.onrender.com/images/bookcase-with-a-wooden-finish-and-a-metal-frame.png",
    ],
    category: sampleCategories.find(
      (cat) => cat.slug === "bookcases"
    ) as DocumentType<Category>,
    materials: ["wood", "metal"],
    price: 80,
    description: "Bookcase with wooden finish and metal frame.",
    priority: false,
  },
  {
    _id: "60d0fe4f5311236168a109d5",
    name: "HEATHER",
    slug: "heather",
    URLimages: ["https://airneisstaticassets.onrender.com/images/modern-purple-rug-with-floral-pattern.png"],
    category: sampleCategories.find(
      (cat) => cat.slug === "rugs"
    ) as DocumentType<Category>,
    materials: ["wool"],
    price: 35,
    description: "Rug with a wool texture and a purple color",
    priority: false,
  },
  {
    _id: "60d0fe4f5311236168a109d6",
    name: "STIRLING",
    slug: "stirling",
    URLimages: [
      "https://airneisstaticassets.onrender.com/images/ad-of-a-lamp-with-glass-shade-and-thin-silver-base.png",
    ],
    category: sampleCategories.find(
      (cat) => cat.slug === "lamps"
    ) as DocumentType<Category>,
    materials: ["glass", "metal"],
    price: 20,
    description: "Lamp with glass shade and thin silver base",
    priority: false,
  },
  {
    _id: "60d0fe4f5311236168a109d7",
    name: "SKYE",
    slug: "skye",
    URLimages: [
      "https://airneisstaticassets.onrender.com/images/wardrobe-with-a-white-colour-and-3-doors.png",
    ],
    category: sampleCategories.find(
      (cat) => cat.slug === "wardrobes"
    ) as DocumentType<Category>,
    materials: ["wood", "glass"],
    price: 200,
    description: "White wardrobe with a mirror door",
    priority: false,
  },
];

export const sampleUsers: User[] = [
  {
    _id: "65b2de45860c1db56605434d",
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("password"),
    isAdmin: true,
    phoneNumber: '555-1234',
    addresses: [{
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'United Kingdom',
      isDefault: true,
    }],
    paymentCards: [
      {
        bankName: "Visa",
        number: "1234 5678 1234 5678",
        fullName: "John Doe",
        monthExpiration: 12,
        yearExpiration: 2023,
        isDefault: true,
      },
      {
        bankName: "Mastercard",
        number: "1234 5678 1234 5678",
        fullName: "Jane Doe",
        monthExpiration: 12,
        yearExpiration: 2023,
        isDefault: false,
      },
    ],
  },
  {
    name: 'User One',
    email: 'userone@example.com',
    password: bcrypt.hashSync('password'),
    isAdmin: false,
    phoneNumber: '555-5678',
    addresses: [{
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'United Kingdom',
      isDefault: true,
    }],
    paymentCards: [
      {
        bankName: "Visa",
        number: "1234 5678 1234 5678",
        fullName: "John Doe",
        monthExpiration: 12,
        yearExpiration: 2023,
        isDefault: true,
      },
      {
        bankName: "Mastercard",
        number: "1234 5678 1234 5678",
        fullName: "Jane Doe",
        monthExpiration: 12,
        yearExpiration: 2023,
        isDefault: false,
      },
    ],
  },
  {
    name: 'User Two',
    email: 'usertwo@example.com',
    password: bcrypt.hashSync('password'),
    isAdmin: false,
    phoneNumber: '555-6789',
    addresses: [{
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'United Kingdom',
      isDefault: true,
    }],
    paymentCards: [
      {
        bankName: "Visa",
        number: "1234 5678 1234 5678",
        fullName: "John Doe",
        monthExpiration: 12,
        yearExpiration: 2023,
        isDefault: true,
      },
      {
        bankName: "Mastercard",
        number: "1234 5678 1234 5678",
        fullName: "Jane Doe",
        monthExpiration: 12,
        yearExpiration: 2023,
        isDefault: false,
      },
    ],
  },
  {
    _id: "6af9b1768cca374cbd3a8eae",
    name: "Madyson Abshire",
    email: "Madyson.Abshire@hotmail.com",
    password: "$2b$10$hI4gVOQFNQf35/ZZX.XVmesEKWVE4/PeS73zyH8REL1PNOBXD14xy",
    isAdmin: false,
    phoneNumber: "+44 166 240 1816",
    addresses: [
      {
        street: "353 Purdy Terrace",
        city: "East Grace",
        postalCode: "E11 O47I",
        country: "United Kingdom",
        isDefault: false,
      },
    ],
    paymentCards: [
      {
        bankName: "Mastercard",
        number: "4052099095655805",
        fullName: "Madyson Abshire",
        monthExpiration: 6,
        yearExpiration: 2027,
        isDefault: false,
      },
    ],
  },
  {
    _id: "ca04e7ea9bea36ec3d32dff0",
    name: "Tyson Wisoky",
    email: "Tyson_Wisoky23@hotmail.com",
    password: "$2b$10$OjgJQB9LkKdv14r01TulJejoT83xRWmOHwAmMeXNk/3jmEL09dmme",
    isAdmin: false,
    phoneNumber: "+44 6248 283 278",
    addresses: [
      {
        street: "75339 Wisoky Parkway",
        city: "Corbinhaven",
        postalCode: "V79 78SU",
        country: "United Kingdom",
        isDefault: false,
      },
      {
        street: "1101 Harvey Corner",
        city: "New Nathan",
        postalCode: "H94 R90Q",
        country: "United Kingdom",
        isDefault: false,
      },
    ],
    paymentCards: [
      {
        bankName: "Visa",
        number: "4482505931025275",
        fullName: "Tyson Wisoky",
        monthExpiration: 5,
        yearExpiration: 2029,
        isDefault: false,
      },
    ],
  },
];

export const sampleCarouselItems: CarouselItem[] = [
  {
    src: "https://airneisstaticassets.onrender.com/images/bedroom.png",
    alt: "Elegant Bedroom Design",
    caption: "Explore our latest bedroom furniture collections",
  },
  {
    src: "https://airneisstaticassets.onrender.com/images/garden.png",
    alt: "Serene Garden Furniture",
    caption: "Discover the beauty of outdoor living with our garden range",
  },
  {
    src: "https://airneisstaticassets.onrender.com/images/livingroom.png",
    alt: "Modern Living Room",
    caption: "Transform your living space with our contemporary designs",
  },
];

export const sampleContacts: Contact[] = [
  {
    mail: "userone@example.com",
    subject: "Inquiry about product availability",
    message:
      "I would like to know when the MACLEOD sofa will be back in stock. Thank you.",
  },
  {
    mail: "usertwo@example.com",
    subject: "Feedback on recent purchase",
    message:
      "I recently purchased the NESSIE sofa and am extremely satisfied with the quality. Thank you!",
  },
  {
    mail: "userone@example.com",
    subject: "Issue with delivery",
    message:
      "My order for the THISTLE sofa was delayed, and I would like to inquire about the new delivery date.",
  },
];

export const sampleStocks: Stock[] = [
  {
    product: sampleProducts.find(
      (product) => product.slug === "macleod"
    )! as DocumentType<Product>,
    quantity: 5,
  },
  {
    product: sampleProducts.find(
      (product) => product.slug === "nessie"
    )! as DocumentType<Product>,
    quantity: 3,
  },
  {
    product: sampleProducts.find(
      (product) => product.slug === "thistle"
    )! as DocumentType<Product>,
    quantity: 0,
  },
  {
    product: sampleProducts.find(
      (product) => product.slug === "glen"
    )! as DocumentType<Product>,
    quantity: 10,
  },
  {
    product: sampleProducts.find(
      (product) => product.slug === "wallace"
    )! as DocumentType<Product>,
    quantity: 2,
  },
  {
    product: sampleProducts.find(
      (product) => product.slug === "heather"
    )! as DocumentType<Product>,
    quantity: 4,
  },
  {
    product: sampleProducts.find(
      (product) => product.slug === "stirling"
    )! as DocumentType<Product>,
    quantity: 1,
  },
  {
    product: sampleProducts.find(
      (product) => product.slug === "skye"
    )! as DocumentType<Product>,
    quantity: 1,
  },
];

export const sampleOrders: Order[] = [
  {
    _id: "60d0fe4f5311236168a109e0",
    orderNumber: "1001",
    orderItems: [
      {
        name: "MACLEOD",
        quantity: 1,
        image: "https://airneisstaticassets.onrender.com/images/blue-3-seater-sofa.png",
        price: 200,
        product: sampleProducts.find(
          (product) => product.slug === "macleod"
        ) as DocumentType<Product>,
      },
    ],
    shippingAddress: {
      _id: '60d0fe4f5311236168a109f1',
      user: 'Admin User',
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'United Kingdom',
      phoneNumber: '555-1234',
    } as ShippingAddress,
    user: sampleUsers.find(user => user.email === 'admin@example.com')?._id!,
    paymentMethod: 'Card',
    itemsPrice: 200,
    shippingPrice: 20,
    taxPrice: 0,
    totalPrice: 220,
    isPaid: true,
    paidAt: new Date("2023-01-01"),
    isDelivered: true,
    deliveredAt: new Date("2023-01-05"),
    status: OrderStatus.Delivered,
  },
];
