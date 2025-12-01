const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Lecture = require("../models/Lecture");

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.post("/submit", async (req, res) => {
  try {
    const { studentName, lectureId, lat, lon, timestamp } = req.body;

    if (!lectureId) return res.status(400).json({ error: "Missing lecture" });

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(400).json({ error: "Lecture not found" });

    // Distance check
    const dist = distance(lat, lon, lecture.lat, lecture.lon);
    if (dist > 5)
      return res.status(400).json({ error: `Too far away (${dist.toFixed(1)}m)` });

    // Timestamp replay protection (optional)
    if (Date.now() - timestamp > 5 * 60 * 1000)
      return res.status(400).json({ error: "QR expired" });

    const record = new Attendance({
      studentName,
      lectureId,
      time: new Date()
    });

    await record.save();
    res.json({ message: "Attendance marked", distance: dist });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
