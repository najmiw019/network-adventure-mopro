const db = require('../config/db');

exports.getDashboardData = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [userRows] = await db.query(
      'SELECT name, streak_count, total_xp FROM users WHERE user_id = ?', 
      [userId]
    );
    
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    const user = userRows[0];

    const [existingProgress] = await db.query(
      'SELECT * FROM user_progress WHERE user_id = ?', 
      [userId]
    );

    if (existingProgress.length === 0) {
      await db.query(
        'INSERT INTO user_progress (user_id, lesson_id, completion_status) VALUES (?, 1, 0)',
        [userId]
      ).catch(err => console.log("Info/Skip insert progress:", err.message));
    }

    const [levelRows] = await db.query(`
      SELECT 
        l.level_id, 
        l.level_order, 
        l.name, 
        l.description,
        COALESCE(up.completion_status, 0) as status_selesai,
        CASE WHEN up.completion_status = 1 THEN 100 ELSE 0 END AS progress
      FROM learning_levels l
      LEFT JOIN user_progress up ON l.level_id = up.lesson_id AND up.user_id = ?
      ORDER BY l.level_order ASC
    `, [userId]);

    let currentLevel = levelRows.find(l => l.progress < 100);

    if (!currentLevel && levelRows.length > 0) {
      currentLevel = levelRows[levelRows.length - 1];
    }

    const [recRows] = await db.query(
      'SELECT reason FROM recommendations WHERE user_id = ? ORDER BY recommendation_id DESC LIMIT 1', 
      [userId]
    );

    let recommendation = null;
    if (recRows.length > 0) {
      recommendation = {
        title: "Rekomendasi untukmu",
        reason: recRows[0].reason
      };
    } else {
      recommendation = {
        title: "Mulai Petualangan Jaringanmu!",
        reason: "Netto menyarankanmu untuk mempelajari dasar-dasar jaringan komputer di Level 1 terlebih dahulu."
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