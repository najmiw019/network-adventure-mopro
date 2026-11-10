const db = require('../config/db');

// Sync / Buat user baru saat login/register
exports.syncUser = async (req, res) => {
  const { auth_uid, name, email } = req.body;

  if (!auth_uid || !email) {
    return res.status(400).json({ message: 'auth_uid dan email wajib diisi!' });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE auth_uid = ?',
      [auth_uid]
    );

    if (existingUsers.length > 0) {
      return res.status(200).json({
        message: 'User sudah terdaftar',
        user: existingUsers[0]
      });
    }

    const [result] = await db.query(
      'INSERT INTO users (auth_uid, name, email, total_xp, streak_count) VALUES (?, ?, ?, 0, 0)',
      [auth_uid, name || 'User Network', email]
    );

    const [newUser] = await db.query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);

    res.status(201).json({
      message: 'User berhasil didaftarkan!',
      user: newUser[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal sync user', error: error.message });
  }
};

// Ambil Profil User
exports.getUserProfile = async (req, res) => {
  const { auth_uid } = req.params;

  try {
    const [users] = await db.query(
      'SELECT user_id, auth_uid, name, email, total_xp, streak_count, created_at FROM users WHERE auth_uid = ?',
      [auth_uid]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.status(200).json({
      message: 'Profil user berhasil diambil',
      user: users[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil profil', error: error.message });
  }
};