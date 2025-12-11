const express = require("express");
const Teacher = require("../models/Teacher");
const Lecture = require("../models/Lecture");
const AttendanceSession = require("../models/AttendanceSession");
const AttendanceRecord = require("../models/AttendanceRecord");
const router = express.Router();

/* TEACHER APIs */
router.post("/teacher", async (req, res) => {
  const { name } = req.body;
  const teacher = await Teacher.create({ name });
  res.json(teacher);
});

router.get("/teacher", async (req, res) => {
  const list = await Teacher.find();
  res.json(list);
});

router.delete("/teacher/:id", async (req, res) => {
  await Teacher.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

/* LECTURE APIs */
router.post("/lecture", async (req, res) => {
  const { name, teacher } = req.body;
  const lec = await Lecture.create({ name, teacher });
  res.json(lec);
});

router.get("/lecture", async (req, res) => {
  const list = await Lecture.find();
  res.json(list);
});

router.delete("/lecture/:id", async (req, res) => {
  await Lecture.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

/* SESSION APIs */
router.post("/session", async (req, res) => {
  const { lectureId, lectureName, adminLocation, createdAt } = req.body;

  const session = await AttendanceSession.create({
    lectureId,
    lectureName,
    adminLocation,
    createdAt,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // Expiry 5 min
  });

  res.json(session);
});

router.get("/session", async (req, res) => {
  const list = await AttendanceSession.find();
  res.json(list);
});

router.delete("/session/:id", async (req, res) => {
  await AttendanceSession.findByIdAndDelete(req.params.id);
  res.json({ msg: "Session Deleted" });
});

/* MARK ATTENDANCE — WITH PROXY CHECK */
router.post("/mark", async (req, res) => {
  const { sessionId, studentRoll, lectureId, location, ip } = req.body;

  const session = await AttendanceSession.findById(sessionId);
  if (!session) return res.status(400).json({ msg: "Invalid session" });
  if (new Date() > new Date(session.expiresAt)) {
  session.isActive = false;
  await session.save();
  return res.status(410).json({ msg: "QR EXPIRED" });
}


  // QR expired check
  if (new Date() > new Date(session.expiresAt)) {
    session.isActive = false;
    await session.save();
    return res.status(410).json({ msg: "QR EXPIRED" });
  }

  // Duplicate prevention
  const exists = await AttendanceRecord.findOne({
    sessionId,
    studentRoll
  });
  if (exists) {
    return res.status(200).json({ msg: "Already Marked" });
  }

  // PROXY DISTANCE CHECK (Haversine)
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000; // meters

  const dLat = toRad(location.lat - session.adminLocation.lat);
  const dLon = toRad(location.long - session.adminLocation.long);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(session.adminLocation.lat)) *
      Math.cos(toRad(location.lat)) *
      Math.sin(dLon / 2) ** 2;

  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  if (distance > 100) {
    return res.status(403).json({
      msg: "Proxy Attempt Detected — Too far from QR location!",
      distance: distance.toFixed(1) + " meters"
    });
  }

  // Create attendance record
  const rec = await AttendanceRecord.create({
    sessionId,
    studentRoll,
    lectureId,
    location,
    ip,
    timestamp: new Date()
  });

  res.json({
    msg: "Attendance Marked Successfully",
    rec
  });
});

router.get("/all", async (req, res) => {
  const list = await AttendanceRecord.find();
  res.json(list);
});

module.exports = router;
