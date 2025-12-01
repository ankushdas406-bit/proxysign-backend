require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const lectureRoutes = require('./routes/lectures');
const attendanceRoutes = require('./routes/attendance');


const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());



app.use(cors({
  origin: [
    "http://localhost:5173", // local frontend
    "https://proxysign.vercel.app", // production frontend
    "https://proxysign-frontend.vercel.app" // fallback name
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



const PORT = process.env.PORT || 4000;

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use("/api/attendance", require("./routes/attendanceSubmit"));
app.use("/api/stats", require("./routes/stats"));

app.get('/', (req,res)=> res.json({ ok:true, message: 'Proxysign backend is running' }));

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on 0.0.0.0:4000");
});

