const request = require('supertest');
const app = require('../server');
const { sequelize, User, Product, CartItem } = require('../models');
const { generateToken } = require('../utils/jwt');
const { hashPassword } = require('../utils/password');

let userToken;
let regularUser;
let product1, product2;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  regularUser = await User.create({
    email: 'cartuser@example.com',
    password_hash: await hashPassword('cartpassword'),
  });
  userToken = generateToken(regularUser.id);

  product1 = await Product.create({
    name: 'Test Product 1',
    description: 'Description 1',
    price: 10.00,
    stock: 50,
    image_urls: ['http://example.com/p1.jpg'],
    '3d_model_url': 'http://example.com/p1.glb',
  });

  product2 = await Product.create({
    name: 'Test Product 2',
    description: 'Description 2',
    price: 20.00,
    stock: 30,
    image_urls: ['http://example.com/p2.jpg'],
    '3d_model_url': 'http://example.com/p2.glb',
  });
});

afterEach(async () => {
  await CartItem.destroy({ truncate: true, cascade: true });
});

afterAll(async () => {
  await CartItem.destroy({ truncate: true, cascade: true });
  await Product.destroy({ truncate: true, cascade: true });
  await User.destroy({ truncate: true, cascade: true });
  await sequelize.close();
});

describe('Cart Routes', () => {
  describe('POST /api/cart', () => {
    it('should add a new item to the cart', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product_id: product1.id, quantity: 2 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Item added/updated in cart successfully.');
      expect(res.body.cartItem.user_id).toEqual(regularUser.id);
      expect(res.body.cartItem.product_id).toEqual(product1.id);
      expect(res.body.cartItem.quantity).toEqual(2);

      const cartItemInDb = await CartItem.findOne({ where: { user_id: regularUser.id, product_id: product1.id } });
      expect(cartItemInDb).not.toBeNull();
      expect(cartItemInDb.quantity).toEqual(2);
    });

    it('should update quantity if item already exists in cart', async () => {
      await CartItem.create({ user_id: regularUser.id, product_id: product1.id, quantity: 1 });

      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product_id: product1.id, quantity: 3 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Item added/updated in cart successfully.');
      expect(res.body.cartItem.quantity).toEqual(4); // 1 (initial) + 3 (added)

      const cartItemInDb = await CartItem.findOne({ where: { user_id: regularUser.id, product_id: product1.id } });
      expect(cartItemInDb.quantity).toEqual(4);
    });

    it('should return 400 for missing product_id or quantity', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product_id: product1.id });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Product ID and a positive quantity are required.');
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product_id: 'non-existent-product-id', quantity: 1 });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Product not found.');
    });

    it('should return 400 if quantity exceeds stock', async () => {
      const res = await request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ product_id: product1.id, quantity: product1.stock + 1 });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', `Not enough stock for ${product1.name}. Available: ${product1.stock}`);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .post('/api/cart')
        .send({ product_id: product1.id, quantity: 1 });
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/cart', () => {
    it('should retrieve the user\'s cart with product details', async () => {
      await CartItem.create({ user_id: regularUser.id, product_id: product1.id, quantity: 2 });
      await CartItem.create({ user_id: regularUser.id, product_id: product2.id, quantity: 1 });

      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('cartItems');
      expect(res.body.cartItems).toHaveLength(2);
      expect(res.body.cartItems[0]).toHaveProperty('Product');
      expect(res.body.cartItems[0].Product.name).toBe(product1.name);
      expect(res.body).toHaveProperty('totalAmount', '40.00'); // (2 * 10.00) + (1 * 20.00)
    });

    it('should return an empty cart if no items', async () => {
      const res = await request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.cartItems).toHaveLength(0);
      expect(res.body).toHaveProperty('totalAmount', '0.00');
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app).get('/api/cart');
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('PUT /api/cart/:id', () => {
    let cartItem;
    beforeEach(async () => {
      cartItem = await CartItem.create({ user_id: regularUser.id, product_id: product1.id, quantity: 5 });
    });

    it('should update the quantity of a cart item', async () => {
      const res = await request(app)
        .put(`/api/cart/${cartItem.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 3 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Cart item quantity updated successfully.');
      expect(res.body.cartItem.quantity).toEqual(3);

      const cartItemInDb = await CartItem.findByPk(cartItem.id);
      expect(cartItemInDb.quantity).toEqual(3);
    });

    it('should remove item if quantity is 0', async () => {
      const res = await request(app)
        .put(`/api/cart/${cartItem.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 0 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Item removed from cart successfully.');

      const cartItemInDb = await CartItem.findByPk(cartItem.id);
      expect(cartItemInDb).toBeNull();
    });

    it('should return 400 for invalid quantity', async () => {
      const res = await request(app)
        .put(`/api/cart/${cartItem.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: -1 });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Quantity must be a non-negative number.');
    });

    it('should return 404 for non-existent cart item', async () => {
      const res = await request(app)
        .put('/api/cart/non-existent-cart-item-id')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Cart item not found.');
    });

    it('should return 400 if updated quantity exceeds stock', async () => {
      const res = await request(app)
        .put(`/api/cart/${cartItem.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: product1.stock + 1 });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', `Not enough stock for product. Available: ${product1.stock}`);
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app)
        .put(`/api/cart/${cartItem.id}`)
        .send({ quantity: 1 });
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('DELETE /api/cart/:id', () => {
    let cartItem;
    beforeEach(async () => {
      cartItem = await CartItem.create({ user_id: regularUser.id, product_id: product1.id, quantity: 1 });
    });

    it('should remove an item from the cart', async () => {
      const res = await request(app)
        .delete(`/api/cart/${cartItem.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Item removed from cart successfully.');

      const cartItemInDb = await CartItem.findByPk(cartItem.id);
      expect(cartItemInDb).toBeNull();
    });

    it('should return 404 for non-existent cart item', async () => {
      const res = await request(app)
        .delete('/api/cart/non-existent-cart-item-id')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Cart item not found.');
    });

    it('should return 401 if not authenticated', async () => {
      const res = await request(app).delete(`/api/cart/${cartItem.id}`);
      expect(res.statusCode).toEqual(401);
    });
  });
});
