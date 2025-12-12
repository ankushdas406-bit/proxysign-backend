const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Create Express App
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/lectures", require("./routes/lectures"));
app.use("/api/teachers", require("./routes/teachers"));
app.use("/api/stats", require("./routes/stats"));

// Default route
app.get("/", (req, res) => {
  res.send("Proxysign Backend is Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
