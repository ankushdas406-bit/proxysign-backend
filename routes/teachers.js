const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const auth = require("../middleware/auth");
const authMiddleware = require("../middleware/auth");


// GET ALL TEACHERS
router.get("/", auth, async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
});

// CREATE TEACHER
router.post("/", auth, async (req, res) => {
  const teacher = new Teacher(req.body);
  await teacher.save();
  res.json(teacher);
});
// DELETE TEACHER
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
