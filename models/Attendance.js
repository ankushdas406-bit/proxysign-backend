const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  name: { type: String, default: 'Student' },
  lectureId: { type: String, required: true },
  time: { type: Date, default: Date.now },
  lat: { type: Number },
  lon: { type: Number },
  distance: { type: Number } // distance in meters
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
