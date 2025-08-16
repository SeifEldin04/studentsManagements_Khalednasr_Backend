require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// User Route
const usersRoute = require('./src/routes/user.route');
app.use('/api/users', usersRoute);

// center route
const centersRoute = require('./src/routes/center.route');
app.use('/api/centers', centersRoute)

// center schedules route
const centerSchedulesRoute = require('./src/routes/centerSchedules.route');
app.use('/api/center_schedules', centerSchedulesRoute);

// students route
const studentsRoute = require('./src/routes/student.route')
app.use('/api/students', studentsRoute)

// exam scores route
const examScoresRoute = require('./src/routes/examScores.route')
app.use('/api/exam_scores', examScoresRoute)

// attendance route 
const attendanceRoute = require('./src/routes/attendance.route')
app.use('/api/attendance', attendanceRoute)

// Database check
const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to DB:', err);
  } else {
    console.log('✅ Connected to Supabase PostgreSQL at:', res.rows[0].now);
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
