const branchSchema=require('../model/admin_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const key = "Hello";

// Hardcoded username and password
const hardcodedUsername = "admin";
const hardcodedPassword = "123"; // Note: In a real-world scenario, you'd store the hashed password

const AdminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username matches the hardcoded one
    if (username !== hardcodedUsername) {
      return res.json({ success: false, message: 'Incorrect username or password' });
    }

    // Check if the password matches the hardcoded one
    const isMatch = (password === hardcodedPassword); // Use bcrypt.compare for hashed passwords
    if (!isMatch) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    const data = { id: 'hardcoded-id' }; // Use a dummy id for testing
    const token = jwt.sign(data, key);
    const success = true;

    res.json({ token, success });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { AdminLogin };