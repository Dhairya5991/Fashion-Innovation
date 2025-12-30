const passport = require('passport');
const { verifyToken } = require('../utils/jwt');

/**
 * Middleware to authenticate requests using JWT.
 * Attaches the authenticated user to `req.user`.
 * If authentication fails, sends a 401 Unauthorized response.
 */
const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Auth error:', err);
      return next(err);
    }
    if (!user) {
      console.warn('Authentication failed:', info ? info.message : 'No user found');
      return res.status(401).json({ message: 'Unauthorized', details: info ? info.message : 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware to check if the authenticated user is an admin.
 * (Placeholder for now, assumes no explicit admin role. Can be extended.)
 * If authorization fails, sends a 403 Forbidden response.
 */
const authorizeAdmin = (req, res, next) => {
  // In a real application, you would check req.user.role or similar.
  // For now, we'll assume only certain routes need this and will be controlled by specific logic.
  // This is a placeholder and should be implemented based on your user role management.
  // For demonstration, we'll just allow it, or you can uncomment the 403 response.
  // if (req.user && req.user.isAdmin) { // Example: assuming an 'isAdmin' property on user object
  //   next();
  // } else {
  //   return res.status(403).json({ message: 'Forbidden: Admin access required.' });
  // }
  next(); // Temporarily allow all for demonstration
};

module.exports = {
  authenticateJWT,
  authorizeAdmin,
};
