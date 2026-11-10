// Mock tabel learning_levels (+ teks Mission Briefing)
export const levels = [
  { level_id: 1, level_order: 1, name: 'Basic Networking', subtitle: 'Welcome to Network!', difficulty: 'Mudah',
    briefing: 'Selamat datang, Network Explorer! Sebelum membangun jaringan pertamamu, kamu harus mengenal apa itu jaringan komputer dan bagaimana perangkat saling terhubung. Siap memulai petualangan?' },
  { level_id: 2, level_order: 2, name: 'Network Devices', subtitle: 'Build Your First Network', difficulty: 'Mudah–Menengah',
    briefing: 'Sekarang kamu sudah mengenal jaringan komputer. Saatnya membangun jaringan pertamamu! Tetapi sebelum itu, kenali dulu perangkat yang akan kamu gunakan.' },
  { level_id: 3, level_order: 3, name: 'IP Address', subtitle: 'Configure Your Network', difficulty: 'Menengah',
    briefing: 'Jaringan pertamamu sudah terhubung secara fisik! Tapi kedua komputer belum tentu bisa saling bertukar data. Sekarang saatnya memberikan alamat IP agar mereka bisa berkomunikasi.' },
  { level_id: 4, level_order: 4, name: 'Internet & Protocol', subtitle: 'Follow the Data Packet', difficulty: 'Menengah',
    briefing: 'Kamu sudah berhasil menghubungkan dan mengonfigurasi jaringan. Tapi pernah penasaran bagaimana data bisa berpindah dari komputermu menuju sebuah website? Ayo ikuti perjalanan paket data!' },
  { level_id: 5, level_order: 5, name: 'Network Troubleshooting', subtitle: 'Fix the Broken Network', difficulty: 'Menengah–Sulit',
    briefing: 'Emergency! Jaringan di sebuah kantor tiba-tiba bermasalah. Komputer terhubung ke jaringan lokal, tetapi tidak bisa mengakses internet. Bisakah kamu menemukan penyebabnya?' },
  { level_id: 6, level_order: 6, name: 'Network Master', subtitle: 'The Final Network Challenge', difficulty: 'Sulit',
    briefing: 'Congratulations, Explorer! Kamu telah melewati lima tantangan. Sekarang kamu mendapatkan misi terakhir: membangun jaringan yang menghubungkan dua laboratorium komputer. Gunakan semua kemampuan yang sudah kamu pelajari!' },
];

// status: 'done' | 'open' | 'locked'
export function getLevelStatus(level, completedLevels) {
  if (completedLevels.includes(level.level_id)) return 'done';
  const prevDone = level.level_order === 1 || completedLevels.includes(level.level_id - 1);
  return prevDone ? 'open' : 'locked';
}

// Deskripsi singkat untuk label di Network Map
export const levelDesc = {
  1: 'Mengenal jaringan, LAN, MAN, WAN',
  2: 'Kenali perangkat jaringan',
  3: 'Alamat IP dan subnet',
  4: 'Perjalanan paket data',
  5: 'Perbaiki jaringan rusak',
  6: 'Tantangan akhir',
};
