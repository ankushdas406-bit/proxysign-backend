const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// TEMPORARY ADMIN CREATION ROUTE (DELETE AFTER USE)
router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const newAdmin = await User.create({
      name: name || "Admin",
      email,
      password,
      role: "admin"
    });

    res.json({ message: "Admin created", user: newAdmin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // USE SAME SECRET FOR BOTH SIGN + VERIFY
    const JWT_SECRET = process.env.JWT_SECRET || "DEFAULT_DEV_SECRET";
    console.log("LOGIN using secret:", JWT_SECRET);

    // CREATE TOKEN
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

