// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access denied');

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your_jwt_secret'
    );
    req.user = decoded; // Attach the decoded token data (user ID) to req.user
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).send('Invalid token');
  }
};

module.exports = verifyToken;
