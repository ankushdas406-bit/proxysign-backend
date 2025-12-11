const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teacher: { type: String, required: true },
});

module.exports = mongoose.model("Lecture", LectureSchema);
