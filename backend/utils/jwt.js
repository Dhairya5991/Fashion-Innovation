const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = '1d'; // Token expires in 1 day

/**
 * Generates a JSON Web Token (JWT).
 * @param {string} id - The user ID to include in the token payload.
 * @returns {string} - The generated JWT.
 */
const generateToken = (id) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

/**
 * Verifies a JSON Web Token (JWT).
 * @param {string} token - The JWT to verify.
 * @returns {object | null} - The decoded payload if valid, null otherwise.
 */
const verifyToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
