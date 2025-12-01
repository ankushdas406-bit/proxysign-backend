const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");

// GET all attendance
router.get("/", auth, async (req, res) => {
  try {
    const records = await Attendance.find().sort({ time: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
