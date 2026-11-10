const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1. GET QUIZ SOAL PER LESSON
router.get('/quiz/:lesson_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT question_id, question, options, answer_key, explanation FROM quiz_questions WHERE lesson_id = ?',
      [req.params.lesson_id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal mengambil soal kuis' });
  }
});

// 2. SUBMIT QUIZ (Hitung Skor, Tambah XP, Unlock Level)
router.post('/quiz/submit', async (req, res) => {
  const { user_id = 1, lesson_id = 1, answers = [] } = req.body;

  try {
    const [questions] = await db.query(
      'SELECT question_id, answer_key FROM quiz_questions WHERE lesson_id = ?',
      [lesson_id]
    );

    let score = 0;
    answers.forEach((ans) => {
      const q = questions.find((item) => item.question_id === ans.question_id);
      if (q && q.answer_key === ans.user_answer) {
        score += 1;
      }
    });

    const totalQuestions = questions.length || 5;
    const percentage = Math.round((score / totalQuestions) * 100);
    const xpGained = score * 20;

    await db.query(
      `INSERT INTO user_progress (user_id, lesson_id, status, score) 
       VALUES (?, ?, 'completed', ?) 
       ON DUPLICATE KEY UPDATE status = 'completed', score = GREATEST(score, ?)`,
      [user_id, lesson_id, percentage, percentage]
    );

    let nextLevel = Number(lesson_id);
    if (percentage >= 60) {
      nextLevel = Number(lesson_id) + 1;
      await db.query(
        `UPDATE users 
         SET total_xp = total_xp + ?, 
             unlocked_level = GREATEST(unlocked_level, ?) 
         WHERE user_id = ?`,
        [xpGained, nextLevel, user_id]
      );
    }

    res.json({
      success: true,
      message: 'Kuis berhasil disubmit!',
      data: { score, totalQuestions, percentage, xpGained, unlockedLevel: nextLevel }
    });
  } catch (err) {
    console.error('Error submit quiz:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses kuis' });
  }
});

module.exports = router;