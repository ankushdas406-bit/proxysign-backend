const express = require("express");
const router = express.Router();
const Lecture = require("../models/Lecture");
const auth = require("../middleware/auth");

// GET ALL LECTURES
router.get("/", auth, async (req, res) => {
  const lectures = await Lecture.find().sort({ createdAt: -1 });
  res.json(lectures);
});

// CREATE LECTURE
router.post("/", auth, async (req, res) => {
  try {
    const lecture = await Lecture.create({
      title: req.body.title,
      lat: req.body.lat || null,
      lon: req.body.lon || null
    });
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE LECTURE
router.delete("/:id", auth, async (req, res) => {
  try {
    await Lecture.findByIdAndDelete(req.params.id);
    res.json({ message: "Lecture deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
