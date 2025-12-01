const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const Lecture = require("../models/Lecture");
const Attendance = require("../models/Attendance");

// GET STATISTICS
router.get("/", async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalAttendance = await Attendance.countDocuments();

    res.json({
      totalTeachers,
      totalLectures,
      totalAttendance
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
