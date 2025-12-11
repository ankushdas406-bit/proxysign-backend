const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "teacher", "student"] },
  branch: String,
  roll: String
});

module.exports = mongoose.model("User", UserSchema);
