// Mock data, strukturnya disamakan dengan tabel users & user_progress
export const user = {
  user_id: 1,
  name: 'Adventure',
  email: 'adventure@mail.com',
  total_xp: 120,
  streak_count: 3,
  completedLevels: [1],   // level_id yang sudah selesai
  currentProgress: 49,    // % progres materi level yang sedang dikerjakan
};

// Mock tabel recommendations
export const recommendation = {
  lesson_id: 1,
  title: 'Perbedaan LAN, MAN, dan WAN',
  reason: 'Akurasi kuis topik ini masih rendah. Yuk ulas sebentar.',
};
