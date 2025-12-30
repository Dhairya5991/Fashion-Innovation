const request = require('supertest');
const app = require('../server');
const { sequelize, User, Product } = require('../models');
const { generateToken } = require('../utils/jwt');
const { hashPassword } = require('../utils/password');

let adminToken;
let userToken;
let adminUser;
let regularUser;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // Create an admin user (for testing admin routes)
  adminUser = await User.create({
    email: 'admin@example.com',
    password_hash: await hashPassword('adminpassword'),
    // In a real app, you'd have a 'role' or 'isAdmin' field
    // For this test, we'll assume any authenticated user can act as admin for authorizeAdmin middleware
  });
  adminToken = generateToken(adminUser.id);

  // Create a regular user (for testing public/user routes)
  regularUser = await User.create({
    email: 'user@example.com',
    password_hash: await hashPassword('userpassword'),
  });
  userToken = generateToken(regularUser.id);
});

afterEach(async () => {
  await Product.destroy({ truncate: true, cascade: true });
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true }); // Clean up users
  await sequelize.close();
});

describe('Product Routes', () => {
  const testProduct = {
    name: 'Vintage T-Shirt',
    description: 'A classic vintage cotton t-shirt.',
    price: 25.99,
    stock: 100,
    category: 'Apparel',
    image_urls: ['http://example.com/tshirt1.jpg'],
    sustainability_metrics: { material: 'cotton', impact: 'low' },
    '3d_model_url': 'http://example.com/tshirt.glb',
  };

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      await Product.create(testProduct);
      await Product.create({ ...testProduct, name: 'Denim Jeans', price: 59.99, category: 'Bottoms' });

      const res = await request(app).get('/api/products');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe('Vintage T-Shirt');
    });

    it('should return products filtered by category', async () => {
      await Product.create(testProduct);
      await Product.create({ ...testProduct, name: 'Denim Jeans', price: 59.99, category: 'Bottoms' });

      const res = await request(app).get('/api/products?category=Apparel');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Vintage T-Shirt');
    });

    it('should return products filtered by search term', async () => {
      await Product.create(testProduct);
      await Product.create({ ...testProduct, name: 'Denim Jeans', description: 'Comfortable denim pants.', price: 59.99, category: 'Bottoms' });

      const res = await request(app).get('/api/products?search=vintage');
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe('Vintage T-Shirt');

      const res2 = await request(app).get('/api/products?search=pants');
      expect(res2.statusCode).toEqual(200);
      expect(res2.body).toHaveLength(1);
      expect(res2.body[0].name).toBe('Denim Jeans');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a single product by ID', async () => {
      const product = await Product.create(testProduct);
      const res = await request(app).get(`/api/products/${product.id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.id).toEqual(product.id);
      expect(res.body.name).toEqual(testProduct.name);
    });

    it('should return 404 if product not found', async () => {
      const res = await request(app).get('/api/products/non-existent-id');
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Product not found.');
    });
  });

  describe('POST /api/products (Admin Only)', () => {
    it('should create a new product for an authenticated admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testProduct);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Product created successfully.');
      expect(res.body.product.name).toEqual(testProduct.name);

      const productInDb = await Product.findByPk(res.body.product.id);
      expect(productInDb).not.toBeNull();
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/products')
        .send(testProduct);
      expect(res.statusCode).toEqual(401);
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidProduct = { name: 'Invalid Product' }; // Missing price, stock
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(invalidProduct);
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Name, price, and stock are required and must be valid.');
    });
  });

  describe('PUT /api/products/:id (Admin Only)', () => {
    let product;
    beforeEach(async () => {
      product = await Product.create(testProduct);
    });

    it('should update an existing product for an authenticated admin', async () => {
      const updatedData = { name: 'Updated T-Shirt', price: 30.00, stock: 90 };
      const res = await request(app)
        .put(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedData);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Product updated successfully.');
      expect(res.body.product.name).toEqual('Updated T-Shirt');
      expect(parseFloat(res.body.product.price)).toEqual(30.00);
      expect(res.body.product.stock).toEqual(90);

      const productInDb = await Product.findByPk(product.id);
      expect(productInDb.name).toEqual('Updated T-Shirt');
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .put(`/api/products/${product.id}`)
        .send({ name: 'Unauthorized Update' });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 404 if product not found', async () => {
      const res = await request(app)
        .put('/api/products/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Non Existent' });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Product not found.');
    });
  });

  describe('DELETE /api/products/:id (Admin Only)', () => {
    let product;
    beforeEach(async () => {
      product = await Product.create(testProduct);
    });

    it('should delete a product for an authenticated admin', async () => {
      const res = await request(app)
        .delete(`/api/products/${product.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Product deleted successfully.');

      const productInDb = await Product.findByPk(product.id);
      expect(productInDb).toBeNull();
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .delete(`/api/products/${product.id}`);
      expect(res.statusCode).toEqual(401);
    });

    it('should return 404 if product not found', async () => {
      const res = await request(app)
        .delete('/api/products/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Product not found.');
    });

    // Add a test for foreign key constraint if a product is in cart/order
    // This requires creating CartItem/OrderItem first, which is covered in cart tests.
    // For now, assume onDelete: 'RESTRICT' is handled by the model.
  });
});
