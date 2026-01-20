const mongoose = require('mongoose')
const Product = require('./models/Product')
const config = require('./config')

const dummyProducts = [
  // Women's Clothing
  {
    title: "Elegant Red Dress",
    description: "A stunning red dress perfect for evening events. Made from sustainable materials.",
    priceINR: 2999,
    images: ["https://example.com/red-dress.jpg"],
    inventory: 20,
    categories: ["Dresses", "Women", "Evening Wear"],
    sku: "RD001",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/red-dress.glb", format: "glb" }],
    ecoTag: "Sustainable"
  },
  {
    title: "Summer Floral Skirt",
    description: "Light and airy floral skirt for summer days.",
    priceINR: 1499,
    images: ["https://example.com/floral-skirt.jpg"],
    inventory: 25,
    categories: ["Skirts", "Women", "Summer"],
    sku: "FS005",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/floral-skirt.glb", format: "glb" }],
    ecoTag: "Eco-Friendly Dye"
  },
  {
    title: "Women's White Blouse",
    description: "Classic white blouse perfect for office or casual wear.",
    priceINR: 1299,
    images: ["https://example.com/white-blouse.jpg"],
    inventory: 35,
    categories: ["Tops", "Women", "Casual"],
    sku: "WB006",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/white-blouse.glb", format: "glb" }],
    ecoTag: "Organic Cotton"
  },
  {
    title: "Women's Denim Jacket",
    description: "Stylish denim jacket for a cool, casual look.",
    priceINR: 2499,
    images: ["https://example.com/denim-jacket-women.jpg"],
    inventory: 18,
    categories: ["Jackets", "Women", "Casual"],
    sku: "DJW007",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/denim-jacket-women.glb", format: "glb" }],
    ecoTag: "Recycled Denim"
  },

  // Men's Clothing
  {
    title: "Casual Blue Jeans",
    description: "Comfortable blue jeans for everyday wear.",
    priceINR: 1999,
    images: ["https://example.com/blue-jeans.jpg"],
    inventory: 50,
    categories: ["Pants", "Men", "Casual"],
    sku: "BJ002",
    sizes: ["28", "30", "32", "34", "36", "38", "40"],
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
    sizes: ["7", "8", "9", "10", "11", "12"],
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
    title: "Men's Polo Shirt",
    description: "Comfortable polo shirt for casual outings.",
    priceINR: 899,
    images: ["https://example.com/polo-shirt.jpg"],
    inventory: 40,
    categories: ["Tops", "Men", "Casual"],
    sku: "PS008",
    sizes: ["S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/polo-shirt.glb", format: "glb" }],
    ecoTag: "Sustainable Fabric"
  },
  {
    title: "Men's Formal Shirt",
    description: "Elegant formal shirt for office wear.",
    priceINR: 1599,
    images: ["https://example.com/formal-shirt.jpg"],
    inventory: 28,
    categories: ["Tops", "Men", "Formal"],
    sku: "FS009",
    sizes: ["S", "M", "L", "XL", "XXL"],
    arModels: [{ url: "https://example.com/formal-shirt.glb", format: "glb" }],
    ecoTag: "Wrinkle-Free"
  },

  // Kids' Clothing
  {
    title: "Kids' Cartoon T-Shirt",
    description: "Fun cartoon t-shirt for playful kids.",
    priceINR: 599,
    images: ["https://example.com/kids-tshirt.jpg"],
    inventory: 60,
    categories: ["Tops", "Kids", "Casual"],
    sku: "KT010",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    arModels: [{ url: "https://example.com/kids-tshirt.glb", format: "glb" }],
    ecoTag: "Kid-Friendly Materials"
  },
  {
    title: "Kids' Denim Shorts",
    description: "Comfortable denim shorts for summer fun.",
    priceINR: 799,
    images: ["https://example.com/kids-shorts.jpg"],
    inventory: 45,
    categories: ["Shorts", "Kids", "Summer"],
    sku: "KS011",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    arModels: [{ url: "https://example.com/kids-shorts.glb", format: "glb" }],
    ecoTag: "Organic Cotton"
  },
  {
    title: "Kids' Hoodie",
    description: "Warm and cozy hoodie for chilly days.",
    priceINR: 1299,
    images: ["https://example.com/kids-hoodie.jpg"],
    inventory: 32,
    categories: ["Hoodies", "Kids", "Winter"],
    sku: "KH012",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    arModels: [{ url: "https://example.com/kids-hoodie.glb", format: "glb" }],
    ecoTag: "Thermal Insulation"
  },
  {
    title: "Kids' Sneakers",
    description: "Colorful sneakers for active kids.",
    priceINR: 1899,
    images: ["https://example.com/kids-sneakers.jpg"],
    inventory: 25,
    categories: ["Shoes", "Kids", "Casual"],
    sku: "KS013",
    sizes: ["1", "2", "3", "4", "5", "6"],
    arModels: [{ url: "https://example.com/kids-sneakers.glb", format: "glb" }],
    ecoTag: "Durable & Flexible"
  },
  {
    title: "Kids' Party Dress",
    description: "Beautiful party dress for special occasions.",
    priceINR: 1999,
    images: ["https://example.com/kids-party-dress.jpg"],
    inventory: 20,
    categories: ["Dresses", "Kids", "Party"],
    sku: "KPD014",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    arModels: [{ url: "https://example.com/kids-party-dress.glb", format: "glb" }],
    ecoTag: "Sparkly & Safe"
  },

  // Accessories (unisex)
  {
    title: "Leather Belt",
    description: "Classic leather belt to complement any outfit.",
    priceINR: 899,
    images: ["https://example.com/leather-belt.jpg"],
    inventory: 55,
    categories: ["Accessories", "Men", "Belts"],
    sku: "LB015",
    sizes: ["S", "M", "L", "XL"],
    arModels: [{ url: "https://example.com/leather-belt.glb", format: "glb" }],
    ecoTag: "Genuine Leather"
  },
  {
    title: "Fashion Sunglasses",
    description: "Stylish sunglasses for sun protection and fashion.",
    priceINR: 1499,
    images: ["https://example.com/sunglasses.jpg"],
    inventory: 40,
    categories: ["Accessories", "Unisex", "Sunglasses"],
    sku: "FS016",
    sizes: ["One Size"],
    arModels: [{ url: "https://example.com/sunglasses.glb", format: "glb" }],
    ecoTag: "UV Protection"
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