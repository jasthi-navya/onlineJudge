const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const User = require('../models/User_schema');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token found in the request headers');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    console.log('Token:', token); // Log the token for debugging
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
