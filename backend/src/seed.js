const mongoose = require('mongoose')
const Product = require('./models/Product')
const config = require('./config')

const dummyProducts = [
  {
    title: "Elegant Red Dress",
    description: "A stunning red dress perfect for evening events. Made from sustainable materials.",
    priceINR: 2999,
    images: ["https://example.com/red-dress.jpg"],
    inventory: 20,
    categories: ["Dresses", "Women", "Evening Wear"],
    sku: "RD001",
    sizes: ["S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/red-dress.glb", format: "glb" }],
    ecoTag: "Sustainable"
  },
  {
    title: "Casual Blue Jeans",
    description: "Comfortable blue jeans for everyday wear.",
    priceINR: 1999,
    images: ["https://example.com/blue-jeans.jpg"],
    inventory: 50,
    categories: ["Pants", "Men", "Casual"],
    sku: "BJ002",
    sizes: ["S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/blue-jeans.glb", format: "glb" }],
    ecoTag: "Organic Cotton"
  },
  {
    title: "White Sneakers",
    description: "Stylish white sneakers with great comfort.",
    priceINR: 3499,
    images: ["https://example.com/white-sneakers.jpg"],
    inventory: 30,
    categories: ["Shoes", "Men", "Casual"],
    sku: "WS003",
    sizes: ["S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/white-sneakers.glb", format: "glb" }],
    ecoTag: "Recycled Materials"
  },
  {
    title: "Black Leather Jacket",
    description: "Classic black leather jacket for a bold look.",
    priceINR: 4999,
    images: ["https://example.com/black-jacket.jpg"],
    inventory: 15,
    categories: ["Jackets", "Men", "Outerwear"],
    sku: "BJ004",
    sizes: ["S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/black-jacket.glb", format: "glb" }],
    ecoTag: "Vegan Leather"
  },
  {
    title: "Summer Floral Skirt",
    description: "Light and airy floral skirt for summer days.",
    priceINR: 1499,
    images: ["https://example.com/floral-skirt.jpg"],
    inventory: 25,
    categories: ["Skirts", "Women", "Summer"],
    sku: "FS005",
    sizes: ["S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/floral-skirt.glb", format: "glb" }],
    ecoTag: "Eco-Friendly Dye"
  }
]

async function seed() {
  try {
    await mongoose.connect(config.mongoUri)
    console.log('Connected to MongoDB')

    // Clear existing products
    await Product.deleteMany({})
    console.log('Cleared existing products')

    // Insert dummy products
    await Product.insertMany(dummyProducts)
    console.log('Inserted dummy products')

    console.log('Seeding complete')
  } catch (error) {
    console.error('Seeding failed:', error)
  } finally {
    await mongoose.disconnect()
  }
}

seed()