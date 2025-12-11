const mongoose = require("mongoose");

const AttendanceRecordSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: "AttendanceSession" },
  studentRoll: { type: String, required: true },
  lectureId: { type: String, required: true },
  location: {
    lat: Number,
    long: Number,
  },
  ip: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AttendanceRecord", AttendanceRecordSchema);
