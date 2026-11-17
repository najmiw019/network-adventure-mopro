const db = require('../config/db');

exports.getMapData = async (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ success: false, message: 'ID user tidak valid' });
  }

  try {
    const [userRows] = await db.query(
      'SELECT user_id, unlocked_level FROM users WHERE user_id = ?',
      [userId]
    );
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const [levels] = await db.query(
      'SELECT level_id, level_order, name FROM learning_levels ORDER BY level_order ASC'
    );

    const [completedRows] = await db.query(
      `SELECT l.level_id
       FROM lessons l
       LEFT JOIN user_progress up
         ON up.lesson_id = l.lesson_id AND up.user_id = ?
       GROUP BY l.level_id
       HAVING COUNT(DISTINCT l.lesson_id) =
         COUNT(DISTINCT CASE
           WHEN UPPER(up.completion_status) = 'COMPLETED' THEN l.lesson_id
         END)`,
      [userId]
    );

    const unlockedLevel = Number(userRows[0].unlocked_level) || 1;
    const completedLevels = Array.from(new Set([
      ...completedRows.map(row => row.level_id),
      ...levels
        .filter(level => level.level_order < unlockedLevel)
        .map(level => level.level_id),
    ]));

    res.json({
      success: true,
      levels: levels,
      completedLevels: completedLevels
    });

  } catch (error) {
    console.error('Error fetching map data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeLevel = async (req, res) => {
  const userId = Number(req.params.userId);
  const levelId = Number(req.body.levelId);
  const score = Number(req.body.score);
  const total = Number(req.body.total);

  if (!Number.isInteger(userId) || userId < 1 ||
      !Number.isInteger(levelId) || levelId < 1 ||
      !Number.isInteger(score) || !Number.isInteger(total) ||
      total < 1 || score < 0 || score > total) {
    return res.status(400).json({ success: false, message: 'Data progres tidak valid' });
  }
  const percentage = Math.round((score / total) * 100);
  if (percentage < 60) {
    return res.status(400).json({ success: false, message: 'Nilai minimum untuk menyelesaikan level adalah 60%' });
  }

  let connection;
  let transactionStarted = false;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    transactionStarted = true;

    const [userRows] = await connection.query(
      'SELECT user_id, total_xp, streak_count FROM users WHERE user_id = ? FOR UPDATE',
      [userId]
    );
    if (userRows.length === 0) {
      await connection.rollback();
      transactionStarted = false;
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const [levelRows] = await connection.query(
      'SELECT level_id, level_order FROM learning_levels WHERE level_id = ?',
      [levelId]
    );
    if (levelRows.length === 0) {
      await connection.rollback();
      transactionStarted = false;
      return res.status(404).json({ success: false, message: 'Level tidak ditemukan' });
    }

    const [lessonSummary] = await connection.query(
      `SELECT COUNT(DISTINCT l.lesson_id) AS total_lessons,
              COUNT(DISTINCT CASE
                WHEN UPPER(up.completion_status) = 'COMPLETED' THEN l.lesson_id
              END) AS completed_lessons
       FROM lessons l
       LEFT JOIN user_progress up
         ON up.lesson_id = l.lesson_id AND up.user_id = ?
       WHERE l.level_id = ?`,
      [userId, levelId]
    );
    const totalLessons = Number(lessonSummary[0].total_lessons);
    if (totalLessons === 0) {
      await connection.rollback();
      transactionStarted = false;
      return res.status(404).json({ success: false, message: 'Materi untuk level ini tidak ditemukan' });
    }

    const user = userRows[0];
    const alreadyCompleted = Number(lessonSummary[0].completed_lessons) === totalLessons;
    const [lessonRows] = await connection.query(
      'SELECT lesson_id FROM lessons WHERE level_id = ? ORDER BY lesson_id ASC LIMIT 1',
      [levelId]
    );
    const [rewardRows] = await connection.query(
      `SELECT COUNT(*) AS rewarded_attempts
       FROM quiz_attempts qa
       JOIN lessons l ON l.lesson_id = qa.lesson_id
       WHERE qa.user_id = ? AND l.level_id = ? AND qa.score >= 60`,
      [userId, levelId]
    );
    const alreadyRewarded = Number(rewardRows[0].rewarded_attempts) > 0;

    if (alreadyCompleted && alreadyRewarded) {
      await connection.commit();
      transactionStarted = false;
      return res.json({
        success: true,
        data: {
          completedLevelId: levelId,
          alreadyCompleted: true,
          xpGained: 0,
          totalXp: Number(user.total_xp) || 0,
          streakCount: Number(user.streak_count) || 0,
          streakIncreased: false,
        },
      });
    }

    const currentStreak = Number(user.streak_count) || 0;
    let streakCount = currentStreak;
    let streakIncreased = false;
    let xpGained = 0;

    if (!alreadyRewarded) {
      const [activityRows] = await connection.query(
        `SELECT DATEDIFF(CURDATE(), MAX(DATE(attempted_at))) AS days_since
         FROM quiz_attempts
         WHERE user_id = ? AND score >= 60`,
        [userId]
      );
      const daysSinceActivity = activityRows[0].days_since;
      streakIncreased = daysSinceActivity === null || Number(daysSinceActivity) === 1;
      streakCount = daysSinceActivity === null || Number(daysSinceActivity) > 1
        ? 1
        : Number(daysSinceActivity) === 1
          ? currentStreak + 1
          : currentStreak;
      xpGained = score * 20;
      await connection.query(
        'INSERT INTO quiz_attempts (user_id, lesson_id, score) VALUES (?, ?, ?)',
        [userId, lessonRows[0].lesson_id, percentage]
      );
    }

    if (!alreadyCompleted) {
      await connection.query(
        `UPDATE user_progress up
         JOIN lessons l ON l.lesson_id = up.lesson_id
         SET up.completion_status = 'COMPLETED'
         WHERE up.user_id = ? AND l.level_id = ?`,
        [userId, levelId]
      );
      await connection.query(
        `INSERT INTO user_progress (user_id, lesson_id, completion_status)
         SELECT ?, l.lesson_id, 'COMPLETED'
         FROM lessons l
         LEFT JOIN user_progress up
           ON up.user_id = ? AND up.lesson_id = l.lesson_id
         WHERE l.level_id = ? AND up.progress_id IS NULL`,
        [userId, userId, levelId]
      );
    }

    await connection.query(
      `UPDATE users
       SET total_xp = COALESCE(total_xp, 0) + ?,
           streak_count = ?,
           unlocked_level = GREATEST(COALESCE(unlocked_level, 1), ?)
       WHERE user_id = ?`,
      [xpGained, streakCount, levelRows[0].level_order + 1, userId]
    );
    await connection.commit();
    transactionStarted = false;

    res.json({
      success: true,
      data: {
        completedLevelId: levelId,
        alreadyCompleted,
        xpGained,
        totalXp: (Number(user.total_xp) || 0) + xpGained,
        streakCount,
        streakIncreased,
      },
    });
  } catch (error) {
    if (transactionStarted) {
      await connection.rollback();
    }
    console.error('Error menyimpan progres level:', error);
    res.status(500).json({ success: false, message: 'Gagal menyimpan progres level' });
  } finally {
    connection?.release();
  }
};