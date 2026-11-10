const db = require('../config/db');

// Ambil Flashcards per Lesson ID
exports.getFlashcardsByLesson = async (req, res) => {
  const { lesson_id } = req.params;
  try {
    const [flashcards] = await db.query(
      'SELECT * FROM flashcards WHERE lesson_id = ?',
      [lesson_id]
    );
    res.status(200).json({
      message: 'Flashcards berhasil diambil',
      data: flashcards
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil flashcards', error: error.message });
  }
};

// Ambil Soal Kuis per Lesson ID
exports.getQuizByLesson = async (req, res) => {
  const { lesson_id } = req.params;
  try {
    const [questions] = await db.query(
      'SELECT question_id, lesson_id, topic, question, options FROM quiz_questions WHERE lesson_id = ?',
      [lesson_id]
    );
    res.status(200).json({
      message: 'Soal kuis berhasil diambil',
      data: questions
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil soal kuis', error: error.message });
  }
};

// Submit Hasil Kuis
exports.submitQuiz = async (req, res) => {
  const { user_id, lesson_id, answers } = req.body;

  if (!user_id || !lesson_id || !answers) {
    return res.status(400).json({ message: 'Data submission tidak lengkap' });
  }

  try {
    let correctCount = 0;
    const [questions] = await db.query('SELECT question_id, answer_key FROM quiz_questions WHERE lesson_id = ?', [lesson_id]);
    
    const keyMap = {};
    questions.forEach(q => { keyMap[q.question_id] = q.answer_key; });

    answers.forEach(ans => {
      if (keyMap[ans.question_id] === ans.chosen_answer) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const xpGained = score >= 80 ? 100 : 20;

    await db.query(
      'INSERT INTO quiz_attempts (user_id, lesson_id, score) VALUES (?, ?, ?)',
      [user_id, lesson_id, score]
    );

    if (score >= 80) {
      await db.query('UPDATE users SET total_xp = total_xp + ? WHERE user_id = ?', [xpGained, user_id]);
    }

    res.status(200).json({
      message: 'Kuis berhasil disubmit!',
      result: {
        score,
        xpGained,
        isPassed: score >= 80,
        recommendation: score >= 80 
          ? 'Luar biasa! Pemahamanmu sangat kuat, lanjut ke level berikutnya!' 
          : 'Pemahamanmu masih kurang, yuk baca ulang materi & pelajari flashcard!'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal submit kuis', error: error.message });
  }
};