const express = require('express');
const router = express.Router();
const User = require('../models/User_schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Signup
router.post('/signup', async (req, res) => {
    try {
      const { email, password, role, secretCode } = req.body;
  
      // Check if the email already exists in the database
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      let newUser;
  
      // Signup process based on role
      if (role === 'admin' || role == 'Admin') {
        // Check if the provided secret code matches the expected value for admin
        if (secretCode !== process.env.ADMIN_SECRET_CODE) {
          return res.status(401).json({ message: 'Invalid secret code for admin' });
        }
  
        // Create the new admin user
        newUser = new User({
          email,
          password: hashedPassword,
          role: 'admin',
        });
      } else {
        // Create the new regular user
        newUser = new User({
          email,
          password: hashedPassword,
          role: 'user',
        });
      }
  
      // Save the user to the database
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      // User authentication successful
      const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // Set token expiration time if needed
      });
      const userRole = user.role; // Assuming the user object has a 'role' property
      const userId = user._id;
      res.status(200).json({ message: 'User login successful', token, role: userRole, userid: userId });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;

