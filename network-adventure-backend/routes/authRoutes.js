const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });
    }

    const [result] = await db.query(
      'INSERT INTO users (name, email, password, total_xp, unlocked_level) VALUES (?, ?, ?, 0, 1)',
      [name, email, password]
    );

    res.json({
      success: true,
      message: 'Berhasil mendaftar!',
      data: { user_id: result.insertId, name, email, total_xp: 0, unlocked_level: 1 }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal mendaftar user baru' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      'SELECT user_id, name, email, total_xp, unlocked_level FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Email atau password salah!' });
    }

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: users[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal melakukan login' });
  }
});

module.exports = router;