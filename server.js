require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

// ROUTES
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const lectureRoutes = require('./routes/lectures');
const attendanceRoutes = require('./routes/attendance');
const attendanceSubmit = require('./routes/attendanceSubmit');
const statsRoutes = require('./routes/stats');

const app = express();

// CORS MUST COME FIRST
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://proxysign-frontend.vercel.app",
    "https://proxysign.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// BODY PARSER
app.use(express.json());

// SECURITY HEADERS
app.use(helmet());

// CONNECT MONGODB
mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => { 
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/attendance', attendanceSubmit);
app.use('/api/stats', statsRoutes);

// HEALTH CHECK
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Proxysign backend is running' });
});

// START SERVER
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
