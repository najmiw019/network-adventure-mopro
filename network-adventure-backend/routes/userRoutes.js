const express = require('express');
const router = express.Router();
const db = require('../config/db');

// SYNC USER (LOGIN / REGISTER DARI FRONTEND)
router.post('/sync', async (req, res) => {
  try {
    const { auth_uid, name, email } = req.body;
    
    // Cek apakah user sudah ada berdasarkan email atau auth_uid
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      return res.status(200).json({ 
        success: true, 
        message: 'User berhasil disinkronkan', 
        data: existing[0] 
      });
    }

    // Jika belum ada, masukkan data baru ke database MySQL
    await db.query(
      'INSERT INTO users (auth_uid, name, email, total_xp, unlocked_level) VALUES (?, ?, ?, 0, 1)',
      [auth_uid || email, name, email]
    );

    // Ambil data user yang baru saja dibuat
    const [newUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    res.status(201).json({ 
      success: true, 
      message: 'User baru berhasil didaftarkan', 
      data: newUser[0] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error server pada database' });
  }
});

// GET USER PROFILE BY ID
router.get('/:id', async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT user_id, name, email, total_xp, unlocked_level FROM users WHERE user_id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    res.json({ success: true, data: users[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error server' });
  }
});

module.exports = router;