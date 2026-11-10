const db = require('../config/db');

// Ambil semua daftar Level (untuk Network Map)
exports.getAllLevels = async (req, res) => {
  try {
    const [levels] = await db.query('SELECT * FROM learning_levels ORDER BY level_order ASC');
    res.status(200).json({
      message: 'Daftar level berhasil diambil',
      data: levels
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data level', error: error.message });
  }
};

// Ambil detail materi microlearning berdasarkan ID
exports.getLessonById = async (req, res) => {
  const { id } = req.params;
  try {
    const [lessons] = await db.query(
      'SELECT l.*, ll.name AS level_name FROM lessons l JOIN learning_levels ll ON l.level_id = ll.level_id WHERE l.lesson_id = ?',
      [id]
    );

    if (lessons.length === 0) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }

    res.status(200).json({
      message: 'Detail materi berhasil diambil',
      data: lessons[0]
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil materi', error: error.message });
  }
};