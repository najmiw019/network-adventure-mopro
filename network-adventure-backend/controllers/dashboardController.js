const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [userRows] = await db.query(
      'SELECT name, streak_count, total_xp, unlocked_level FROM users WHERE user_id = ?',
      [userId]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    const user = userRows[0];

    const [levelRows] = await db.query(`
      SELECT
        ll.level_id,
        ll.level_order,
        ll.name,
        COUNT(DISTINCT l.lesson_id) AS total_lessons,
        COUNT(DISTINCT CASE
          WHEN UPPER(up.completion_status) = 'COMPLETED' THEN l.lesson_id
        END) AS completed_lessons
      FROM learning_levels ll
      LEFT JOIN lessons l ON l.level_id = ll.level_id
      LEFT JOIN user_progress up
        ON up.lesson_id = l.lesson_id AND up.user_id = ?
      GROUP BY ll.level_id, ll.level_order, ll.name
      ORDER BY ll.level_order ASC
    `, [userId]);

    const levels = levelRows.map(level => {
      const totalLessons = Number(level.total_lessons) || 0;
      const completedLessons = Number(level.completed_lessons) || 0;
      const progress = level.level_order < (Number(user.unlocked_level) || 1)
        ? 100
        : totalLessons
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;
      return {
        ...level,
        progress
      };
    });
    const currentLevel = levels.find(level => level.progress < 100) || null;

    let recommendation;
    if (currentLevel) {
      const levelName = currentLevel.name.replace(/^Level\s+\d+:\s*/i, '');
      const isContinuation = currentLevel.progress > 0;
      recommendation = {
        title: `${isContinuation ? 'Lanjutkan' : 'Mulai'} Level ${currentLevel.level_order}`,
        reason: currentLevel.level_order === 1
          ? `Netto menyarankanmu mempelajari ${levelName} terlebih dahulu.`
          : `Level sebelumnya selesai! Sekarang pelajari ${levelName}.`
      };
    } else if (levels.length > 0) {
      recommendation = {
        title: 'Semua level selesai!',
        reason: 'Hebat! Kamu sudah menyelesaikan seluruh petualangan jaringan.'
      };
    } else {
      recommendation = {
        title: 'Materi belum tersedia',
        reason: 'Belum ada level pembelajaran di server.'
      };
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        total_xp: user.total_xp,
        streak_count: user.streak_count,
        currentProgress: currentLevel ? currentLevel.progress : 100
      },
      current_level: currentLevel || null,
      recommendation: recommendation
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};