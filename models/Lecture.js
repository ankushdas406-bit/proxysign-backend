const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lat: { type: Number },
  lon: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Lecture", LectureSchema);
