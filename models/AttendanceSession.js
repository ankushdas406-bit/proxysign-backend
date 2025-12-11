const mongoose = require("mongoose");

const AttendanceSessionSchema = new mongoose.Schema(
  {
    lectureId: { type: String, required: true },
    lectureName: { type: String, required: true },
    adminLocation: { type: Object, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000) // expires in 5 min
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AttendanceSession", AttendanceSessionSchema);
