const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL LESSONS
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lessons ORDER BY lesson_id ASC');
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal mengambil materi' });
  }
});

module.exports = router;