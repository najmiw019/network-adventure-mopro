export const quizzes = {
  1: [
    {
      question: 'Apa tujuan utama dari jaringan komputer?',
      options: [
        'Dua atau lebih perangkat yang terhubung untuk berbagi data',
        'Komputer yang memiliki spesifikasi tinggi',
        'Software untuk mengedit video',
        'Kabel listrik yang menyambung ke stopkontak'
      ],
      correctIndex: 0,
      explanation: 'Jaringan komputer dirancang agar berbagai perangkat dapat saling terhubung, bertukar informasi, dan berbagi sumber daya secara efisien.'
    },
    {
      question: 'Manakah di bawah ini yang merupakan media transmisi nirkabel (tanpa kabel)?',
      options: [
        'Kabel UTP (LAN)',
        'Kabel Fiber Optik',
        'Gelombang Radio / Wi-Fi',
        'Kabel Coaxial'
      ],
      correctIndex: 2,
      explanation: 'Wi-Fi memanfaatkan gelombang radio sebagai media transmisi data tanpa memerlukan sambungan kabel fisik.'
    },
    {
      question: 'Mengapa aturan atau protokol sangat penting dalam jaringan komputer?',
      options: [
        'Agar komputer terlihat lebih mahal',
        'Agar perangkat dari berbagai merek bisa saling berkomunikasi',
        'Supaya kuota internet tidak cepat habis',
        'Untuk memperberat kerja prosesor'
      ],
      correctIndex: 1,
      explanation: 'Protokol adalah standar atau bahasa universal yang membuat berbagai perangkat berbeda tetap bisa saling memahami saat bertukar data.'
    }
  ],
  2: [
    {
      question: 'Apa peran utama dari sebuah Server dalam jaringan?',
      options: [
        'Mengisi daya baterai komputer klien',
        'Menyediakan data, layanan, dan pusat kontrol bagi klien',
        'Mematikan jaringan secara otomatis',
        'Menghias tampilan layar utama'
      ],
      correctIndex: 1,
      explanation: 'Server bertindak sebagai pusat penyedia layanan dan penyimpanan data yang diakses oleh komputer klien.'
    },
    {
      question: 'Perangkat apa yang berfungsi menghubungkan antar komputer dalam satu jaringan lokal (LAN)?',
      options: ['Router', 'Switch', 'Satelit', 'Modem seluler'],
      correctIndex: 1,
      explanation: 'Switch adalah perangkat cerdas pengatur lalu lintas data di dalam satu area jaringan lokal (LAN).'
    },
    {
      question: 'Apa fungsi utama dari perangkat Router?',
      options: [
        'Menghubungkan jaringan lokal ke internet global dan memilih jalur terbaik',
        'Mencetak dokumen secara nirkabel',
        'Menyimpan file cadangan foto',
        'Mengubah sinyal analog menjadi suara'
      ],
      correctIndex: 0,
      explanation: 'Router bertugas meneruskan paket data antarjaringan yang berbeda, termasuk menghubungkan LAN ke internet.'
    }
  ],
  3: [
    {
      question: 'Apa singkatan dari LAN dalam istilah jaringan komputer?',
      options: [
        'Local Access Node',
        'Local Area Network',
        'Long Area Navigation',
        'Logical Application Network'
      ],
      correctIndex: 1,
      explanation: 'LAN singkatan dari Local Area Network, yaitu jaringan komputer dengan cakupan area terbatas seperti gedung atau sekolah.'
    },
    {
      question: 'Manakah cakupan wilayah yang paling luas di antara jenis jaringan berikut?',
      options: ['LAN', 'MAN', 'WAN', 'PAN'],
      correctIndex: 2,
      explanation: 'WAN (Wide Area Network) mencakup wilayah antarkota, antarnegara, hingga lintas benua seperti internet.'
    },
    {
      question: 'Jaringan yang mencakup area antarkecamatan atau satu kota disebut...',
      options: ['LAN', 'MAN', 'WAN', 'Bluetooth'],
      correctIndex: 1,
      explanation: 'MAN (Metropolitan Area Network) berada di skala menengah yang menghubungkan beberapa gedung dalam satu perkotaan.'
    }
  ],
  4: [
    {
      question: 'Mengapa data yang dikirimkan melalui internet harus dipecah menjadi paket-paket kecil?',
      options: [
        'Agar ukuran file menjadi lebih besar',
        'Agar proses transmisi lebih efisien, cepat, dan andal',
        'Supaya data tidak bisa dibaca siapa pun',
        'Agar memori komputer cepat penuh'
      ],
      correctIndex: 1,
      explanation: 'Pemecahan data menjadi paket kecil membuat pengiriman lebih fleksibel dan tahan terhadap gangguan jalur.'
    },
    {
      question: 'Apa fungsi dari IP Address pada sebuah perangkat?',
      options: [
        'Sebagai identitas unik pengenal perangkat di dalam jaringan',
        'Untuk mengatur kecerahan layar monitor',
        'Sebagai sandi pelindung virus',
        'Untuk mendeteksi suhu perangkat keras'
      ],
      correctIndex: 0,
      explanation: 'IP Address adalah alamat unik berbasis angka agar perangkat dapat saling mengenali dan mengirim data dengan tepat.'
    },
    {
      question: 'Apa nama proses pengarahan paket data melalui jalur terbaik dari sumber ke tujuan?',
      options: ['Routing', 'Browsing', 'Formatting', 'Streaming'],
      correctIndex: 0,
      explanation: 'Routing adalah proses menentukan jalur paling optimal bagi paket data untuk mencapai tujuan akhirnya.'
    }
  ],
  5: [
    {
      question: 'Topologi jaringan manakah yang menggunakan satu perangkat pusat (Switch/Hub) di tengah?',
      options: ['Topologi Bus', 'Topologi Star', 'Topologi Ring', 'Topologi Mesh'],
      correctIndex: 1,
      explanation: 'Topologi Star menempatkan perangkat pusat di tengah sehingga jika satu kabel rusak, komputer lain tetap aman.'
    },
    {
      question: 'Apa ciri khas utama dari Topologi Bus?',
      options: [
        'Menggunakan satu kabel utama tunggal (backbone) sebagai jalur penghubung',
        'Berbentuk lingkaran tertutup',
        'Setiap komputer terhubung ke semua komputer lain',
        'Menggunakan satelit pemancar'
      ],
      correctIndex: 0,
      explanation: 'Topologi Bus menyambungkan semua perangkat ke satu kabel utama linier (backbone).'
    },
    {
      question: 'Apa risiko utama jika kabel utama (backbone) pada Topologi Bus terputus?',
      options: [
        'Hanya satu komputer yang mati',
        'Kecepatan internet bertambah cepat',
        'Seluruh jaringan akan lumpuh total',
        'Tidak terjadi apa-apa'
      ],
      correctIndex: 2,
      explanation: 'Karena jalurnya cuma satu (kabel utama), putusnya kabel tersebut membuat seluruh komunikasi jaringan terhenti.'
    }
  ],
  6: [
    {
      question: 'Langkah awal apa yang paling tepat saat melakukan troubleshooting kabel jaringan yang tidak terhubung?',
      options: [
        'Langsung membongkar komputer',
        'Memeriksa indikator lampu LED pada port dan memastikan konektor RJ-45 terpasang kencang',
        'Mengganti penyedia layanan internet',
        'Memformat ulang sistem operasi'
      ],
      correctIndex: 1,
      explanation: 'Pengecekan fisik awal seperti konektor dan lampu indikator port adalah langkah pertama paling efektif dalam troubleshooting.'
    },
    {
      question: 'Utilitas atau perintah jaringan apa yang biasa digunakan untuk menguji konektivitas antarkomputer?',
      options: ['Ping', 'Save', 'Copy', 'Print'],
      correctIndex: 0,
      explanation: 'Perintah Ping menggunakan protokol ICMP untuk mengecek apakah perangkat tujuan merespons dan terhubung.'
    },
    {
      question: 'Apa tantangan utama dalam Network Master Challenge?',
      options: [
        'Menghafal seluruh nama pembuat aplikasi',
        'Mengintegrasikan pemahaman perangkat, pengalamatan IP, dan topologi untuk merancang koneksi',
        'Membuat desain grafis 3 dimensi',
        'Mengetik teks secepat mungkin'
      ],
      correctIndex: 1,
      explanation: 'Tantangan akhir ini menguji seluruh penguasaan konsep jaringan secara komprehensif.'
    }
  ]
};

quizzes[6][0] = {
  question: 'Langkah awal apa yang paling tepat saat melakukan troubleshooting kabel jaringan yang tidak terhubung?',
  options: [
    'Langsung membongkar komponen dalam komputer',
    'Memeriksa indikator lampu LED pada port dan memastikan konektor RJ-45 terpasang kencang',
    'Mengganti seluruh perangkat router di rumah',
    'Memformat ulang sistem operasi komputer'
  ],
  correctIndex: 1,
  explanation: 'Pengecekan fisik awal seperti konektor dan lampu indikator port adalah langkah pertama paling efektif dalam troubleshooting.'
};