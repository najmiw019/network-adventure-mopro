require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const mapController = require('./controllers/mapController');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/dashboard', dashboardRoutes);
app.get('/api/map/:userId', mapController.getMapData);
app.post('/api/map/:userId/complete', mapController.completeLevel);

app.get('/', (req, res) => {
  res.send('Welcome to Network Adventure API Server!');
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT NOW() AS waktu_sekarang');
    res.status(200).json({
      message: 'Koneksi ke Database MySQL Berhasil!',
      db_time: rows[0].waktu_sekarang
    });
  } catch (error) {
    res.status(500).json({
      message: 'Koneksi ke Database Gagal!',
      error: error.message
    });
  }
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/activities', activityRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});