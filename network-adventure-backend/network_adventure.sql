-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2026 at 12:31 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `network_adventure`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `achievement_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `criteria` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `flashcards`
--

CREATE TABLE `flashcards` (
  `flashcard_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `front` text NOT NULL,
  `back` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flashcards`
--

INSERT INTO `flashcards` (`flashcard_id`, `lesson_id`, `front`, `back`) VALUES
(1, 1, 'Sebutan untuk dua atau lebih perangkat yang saling terhubung untuk berbagi data?', 'Jaringan Komputer'),
(2, 1, 'Aturan baku yang mengatur bagaimana perangkat saling berkomunikasi di jaringan?', 'Protokol'),
(3, 1, 'Media transmisi tanpa kabel yang memanfaatkan gelombang radio?', 'Nirkabel / Wi-Fi'),
(4, 2, 'Perangkat yang bertindak sebagai pusat penyedia data dan layanan bagi komputer lain?', 'Server'),
(5, 2, 'Perangkat pintar penghubung antar komputer dalam satu jaringan lokal yang sama?', 'Switch'),
(6, 2, 'Perangkat pengatur jalan raya yang menghubungkan jaringan lokal ke internet?', 'Router'),
(7, 3, 'Jenis jaringan yang digunakan dalam satu laboratorium komputer sekolah?', 'LAN (Local Area Network)'),
(8, 3, 'Jaringan yang menghubungkan beberapa kantor cabang bank di area satu kota?', 'MAN (Metropolitan Area Network)'),
(9, 3, 'Jaringan skala internasional yang menghubungkan komputer di seluruh belahan dunia?', 'WAN (Wide Area Network)'),
(10, 4, 'Sebutan untuk pecahan data kecil yang dikirimkan melalui jaringan?', 'Paket Data (Data Packets)'),
(11, 4, 'Identitas unik berupa deretan angka pada perangkat di jaringan?', 'IP Address'),
(12, 4, 'Proses pengarahan paket data dari sumber ke tujuan melalui rute terbaik?', 'Routing'),
(13, 5, 'Topologi yang terhubung ke satu titik pusat (Switch) dan paling populer digunakan saat ini?', 'Topologi Star'),
(14, 5, 'Topologi yang mengandalkan satu kabel utama tunggal (backbone)?', 'Topologi Bus'),
(15, 5, 'Kelemahan utama Topologi Bus adalah...', 'Jika kabel utama putus, seluruh jaringan mati'),
(16, 6, 'Perangkat apa yang digunakan untuk menghubungkan dua jaringan IP berbeda?', 'Router'),
(17, 6, 'Apa yang perlu dikonfigurasi pada PC agar dapat mengirim paket ke subnet lain?', 'Default Gateway'),
(18, 6, 'Apa yang perlu dilakukan setelah menyusun dan mengonfigurasi jaringan?', 'Menguji konektivitas dan memeriksa kesalahan');

-- --------------------------------------------------------

--
-- Table structure for table `flashcard_reviews`
--

CREATE TABLE `flashcard_reviews` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `flashcard_id` int(11) NOT NULL,
  `status` enum('PAHAM','BELUM_PAHAM') NOT NULL,
  `reviewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `learning_levels`
--

CREATE TABLE `learning_levels` (
  `level_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `level_order` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `learning_levels`
--

INSERT INTO `learning_levels` (`level_id`, `name`, `level_order`) VALUES
(1, 'Level 1: Basic Networking', 1),
(2, 'Level 2: Network Devices', 2),
(3, 'Level 3: IP Address', 3),
(4, 'Level 4: Internet & Protocol', 4),
(5, 'Level 5: Network Troubleshooting', 5),
(6, 'Level 6: Network Master', 6);

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `lesson_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `topic` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `level_id`, `title`, `topic`, `content`, `duration`) VALUES
(1, 1, 'Pengenalan & Dasar Jaringan Komputer', 'Basic Networking', 'Jaringan komputer adalah dua atau lebih perangkat yang saling terhubung untuk berbagi data dan sumber daya.', 3),
(2, 2, 'Perangkat Utama Jaringan (Hardware)', 'Network Devices', 'Perangkat keras utama meliputi Server, Client, Switch, Router, dan Media Transmisi.', 4),
(3, 3, 'Jenis & Cakupan Wilayah (LAN, MAN, WAN)', 'IP Address & Scope', 'Jaringan dibagi berdasarkan wilayah: LAN (Gedung/Lab), MAN (Kota), WAN (Negara/Internet).', 5),
(4, 4, 'Cara Kerja & Pengiriman Data (Packet & IP)', 'Internet & Protocol', 'Data dipecah menjadi Paket Data yang diberi label IP Address pengirim & tujuan sebelum di-routing.', 5),
(5, 5, 'Topologi Jaringan & Troubleshooting', 'Troubleshooting', 'Mengenal Topologi Star, Bus, Ring, serta penanganan masalah IP Conflict dan kabel putus.', 5),
(6, 6, 'The Final Network Challenge', 'Network Master', 'Rangkuman seluruh materi jaringan dasar dan integrasi praktikum skala besar.', 5);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_answers`
--

CREATE TABLE `quiz_answers` (
  `answer_id` int(11) NOT NULL,
  `attempt_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `chosen_answer` varchar(255) NOT NULL,
  `is_correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_attempts`
--

CREATE TABLE `quiz_attempts` (
  `attempt_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `question_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `topic` varchar(100) NOT NULL,
  `question` text NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`options`)),
  `answer_key` varchar(255) NOT NULL,
  `explanation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`question_id`, `lesson_id`, `topic`, `question`, `options`, `answer_key`, `explanation`) VALUES
(51, 1, '', 'Apa tujuan utama dari jaringan komputer?', '[\"Dua atau lebih perangkat yang terhubung untuk berbagi data\", \"Komputer yang memiliki spesifikasi tinggi\", \"Software untuk mengedit video\", \"Kabel listrik yang menyambung ke stopkontak\"]', 'Dua atau lebih perangkat yang terhubung untuk berbagi data', 'Jaringan komputer dirancang agar berbagai perangkat dapat saling terhubung dan berbagi sumber daya.'),
(52, 1, '', 'Manakah di bawah ini yang merupakan media transmisi nirkabel (tanpa kabel)?', '[\"Kabel UTP (LAN)\", \"Kabel Fiber Optik\", \"Gelombang Radio / Wi-Fi\", \"Kabel Coaxial\"]', 'Gelombang Radio / Wi-Fi', 'Wi-Fi memanfaatkan gelombang radio sebagai media transmisi data tanpa sambungan kabel fisik.'),
(53, 1, '', 'Mengapa aturan atau protokol sangat penting dalam jaringan komputer?', '[\"Agar komputer terlihat lebih mahal\", \"Agar perangkat dari berbagai merek bisa saling berkomunikasi\", \"Supaya kuota internet tidak cepat habis\", \"Untuk memperberat kerja prosesor\"]', 'Agar perangkat dari berbagai merek bisa saling berkomunikasi', 'Protokol adalah standar resmi yang membuat berbagai perangkat berbeda tetap bisa saling memahami.'),
(54, 1, '', 'Jaringan yang menghubungkan komputer dalam skala area lokal satu gedung dinamakan...', '[\"LAN\", \"MAN\", \"WAN\", \"Internet\"]', 'LAN', 'LAN (Local Area Network) mencakup jaringan lokal terbatas di dalam satu ruangan atau gedung.'),
(55, 1, '', 'Perangkat jaringan yang berfungsi mengarahkan paket data menuju alamat tujuan adalah...', '[\"Router\", \"Printer\", \"Monitor\", \"Keyboard\"]', 'Router', 'Router bertugas menentukan rute terbaik paket data menuju jaringan tujuan.'),
(56, 2, '', 'Topologi jaringan yang menggunakan satu kabel pusat sebagai backbone adalah topologi...', '[\"Bus\", \"Star\", \"Ring\", \"Mesh\"]', 'Bus', 'Topologi Bus menggunakan kabel tunggal pusat tempat semua node/komputer terhubung.'),
(57, 2, '', 'Media transmisi yang mengirimkan data berupa transmisi gelombang cahaya adalah...', '[\"Kabel Fiber Optik\", \"Kabel UTP\", \"Kabel STP\", \"Kabel Coaxial\"]', 'Kabel Fiber Optik', 'Fiber Optik terbuat dari serat kaca dan mentransfer data menggunakan spektrum cahaya.'),
(58, 2, '', 'Konektor standar yang biasa digunakan pada ujung kabel jaringan UTP adalah...', '[\"RJ-45\", \"USB Type-C\", \"HDMI\", \"VGA\"]', 'RJ-45', 'Konektor RJ-45 adalah standar utama pemutus/sambungan kabel LAN UTP.'),
(59, 2, '', 'Pada topologi Star, semua perangkat komputer terhubung langsung ke titik pusat berupa...', '[\"Switch atau Hub\", \"Router Utama\", \"Kabel Coaxial\", \"Modem\"]', 'Switch atau Hub', 'Topologi Star menghubungkan setiap klien secara independen ke pusat kendali Switch/Hub.'),
(60, 2, '', 'Keunggulan utama topologi Mesh dibandingkan topologi lainnya adalah...', '[\"Redundansi tinggi dan jika 1 jalur putus masih ada jalur lain\", \"Pemasangan paling murah\", \"Menggunakan kabel paling sedikit\", \"Sangat mudah dipasang untuk pemula\"]', 'Redundansi tinggi dan jika 1 jalur putus masih ada jalur lain', 'Topologi Mesh menghubungkan antar-node secara dedicated sehingga memiliki keandalan tinggi.'),
(61, 3, '', 'Berapa jumlah bit total pada alamat IPv4?', '[\"32 bit\", \"64 bit\", \"128 bit\", \"16 bit\"]', '32 bit', 'IPv4 terdiri dari 32 bit angka biner yang dibagi menjadi 4 oktet.'),
(62, 3, '', 'Berapa panjang bit total pada alamat IPv6?', '[\"128 bit\", \"32 bit\", \"64 bit\", \"256 bit\"]', '128 bit', 'IPv6 diciptakan dengan panjang 128 bit untuk mengatasi keterbatasan kapasitas IPv4.'),
(63, 3, '', 'Penulisan Subnet Mask standar untuk kelas C dengan CIDR /24 adalah...', '[\"255.255.255.0\", \"255.255.0.0\", \"255.0.0.0\", \"255.255.255.255\"]', '255.255.255.0', 'Prefix /24 berarti 24 bit bernilai 1, yang dalam desimal bernilai 255.255.255.0.'),
(64, 3, '', 'Alamat IP khusus 127.0.0.1 biasanya digunakan untuk fungsi...', '[\"Loopback / Testing local host\", \"IP Public Google\", \"Default Gateway\", \"Broadcast IP\"]', 'Loopback / Testing local host', '127.0.0.1 adalah IP loopback internal untuk menguji stack protokol pada perangkat lokal.'),
(65, 3, '', 'Alamat yang digunakan untuk mengirim pesan sekaligus ke seluruh host dalam 1 jaringan adalah...', '[\"Broadcast Address\", \"Network Address\", \"Host Address\", \"MAC Address\"]', 'Broadcast Address', 'Broadcast Address digunakan untuk mengirimkan paket data ke seluruh komputer di subnet yang sama.'),
(66, 4, '', 'Berapa jumlah lapisan (layer) yang dimiliki oleh OSI Layer Model?', '[\"7 Layer\", \"4 Layer\", \"5 Layer\", \"6 Layer\"]', '7 Layer', 'Model OSI secara konseptual terdiri dari 7 lapisan hirarki.'),
(67, 4, '', 'Lapisan OSI Layer yang berinteraksi langsung dengan aplikasi antarmuka pengguna adalah...', '[\"Application Layer\", \"Physical Layer\", \"Network Layer\", \"Transport Layer\"]', 'Application Layer', 'Application Layer (Layer 7) menyediakan antarmuka layanan langsung ke aplikasi end-user.'),
(68, 4, '', 'Perangkat Switch bekerja di lapisan OSI Layer ke berapa?', '[\"Data Link Layer (Layer 2)\", \"Physical Layer (Layer 1)\", \"Network Layer (Layer 3)\", \"Session Layer (Layer 5)\"]', 'Data Link Layer (Layer 2)', 'Switch bekerja memproses frame berdasarkan alamat fisik MAC pada Data Link Layer.'),
(69, 4, '', 'Protokol Transport Layer yang bersifat connection-oriented dan menjamin pengiriman data adalah...', '[\"TCP\", \"UDP\", \"IP\", \"HTTP\"]', 'TCP', 'TCP (Transmission Control Protocol) memastikan data sampai dengan utuh melalui konfirmasi (ACK).'),
(70, 4, '', 'Protokol HTTP dan HTTPS beroperasi pada lapisan OSI...', '[\"Application Layer\", \"Network Layer\", \"Transport Layer\", \"Data Link Layer\"]', 'Application Layer', 'Protokol web HTTP/HTTPS berada di tingkatan paling atas yaitu Application Layer.'),
(71, 5, '', 'Layanan jaringan yang bertugas memberikan IP Address secara otomatis ke klien adalah...', '[\"DHCP\", \"DNS\", \"FTP\", \"SMTP\"]', 'DHCP', 'DHCP (Dynamic Host Configuration Protocol) mengalokasikan IP secara dinamis.'),
(72, 5, '', 'Layanan yang menerjemahkan nama domain (misal: google.com) menjadi alamat IP adalah...', '[\"DNS\", \"DHCP\", \"HTTP\", \"NAT\"]', 'DNS', 'DNS (Domain Name System) memetakan nama domain ramah manusia ke IP angka komputer.'),
(73, 5, '', 'Protokol standar yang digunakan untuk mentransfer file antar komputer adalah...', '[\"FTP\", \"SMTP\", \"POP3\", \"SNMP\"]', 'FTP', 'FTP (File Transfer Protocol) dirancang khusus untuk keperluan pengiriman/unduh berkas.'),
(74, 5, '', 'Protokol keamanan yang digunakan untuk remote login terenkripsi ke server adalah...', '[\"SSH\", \"Telnet\", \"HTTP\", \"FTP\"]', 'SSH', 'SSH (Secure Shell) menyediakan saluran komunikasi terenkripsi aman untuk akses jarak jauh.'),
(75, 5, '', 'Port standar yang digunakan oleh layanan web terenkripsi HTTPS adalah...', '[\"443\", \"80\", \"21\", \"22\"]', '443', 'Port 443 adalah port default resmi untuk trafik HTTPS (secure web).'),
(76, 6, '', 'Sistem keamanan yang berfungsi menyaring dan memblokir lalu lintas jaringan mencurigakan adalah...', '[\"Firewall\", \"Router\", \"Switch\", \"Hub\"]', 'Firewall', 'Firewall bertindak sebagai benteng pertahanan lalu lintas data berdasarkan aturan keamanan.'),
(77, 6, '', 'Perintah CLI yang digunakan untuk menguji konektivitas antar host dalam jaringan adalah...', '[\"ping\", \"ipconfig\", \"traceroute\", \"netstat\"]', 'ping', 'Perintah ping mengirimkan pesan ICMP Echo Request untuk mengecek apakah target merespons.'),
(78, 6, '', 'Jenis serangan jaringan yang membanjiri server dengan trafik palsu hingga lumpuh disebut...', '[\"DDoS\", \"Phishing\", \"Malware\", \"Man-in-the-Middle\"]', 'DDoS', 'DDoS (Distributed Denial of Service) menghabiskan sumber daya server dengan lonjakan trafik.'),
(79, 6, '', 'Perintah terminal untuk melihat konfigurasi IP Address pada sistem operasi Windows adalah...', '[\"ipconfig\", \"ifconfig\", \"nslookup\", \"route\"]', 'ipconfig', 'ipconfig digunakan pada Windows Command Prompt untuk menampilkan adapter dan IP.'),
(80, 6, '', 'Protokol/Fitur yang digunakan untuk mengonversi IP Private menjadi satu IP Public adalah...', '[\"NAT\", \"VLAN\", \"VPN\", \"Proxy\"]', 'NAT', 'NAT (Network Address Translation) menerjemahkan IP lokal agar bisa mengakses internet.');

-- --------------------------------------------------------

--
-- Table structure for table `recommendations`
--

CREATE TABLE `recommendations` (
  `recommendation_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `status` enum('PENDING','REVIEWED') DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `simulation_attempts`
--

CREATE TABLE `simulation_attempts` (
  `attempt_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `scenario_id` int(11) NOT NULL,
  `is_success` tinyint(1) NOT NULL,
  `score` int(11) NOT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `simulation_scenarios`
--

CREATE TABLE `simulation_scenarios` (
  `scenario_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `scenario_type` varchar(100) NOT NULL,
  `instructions` text NOT NULL,
  `solution` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`solution`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `auth_uid` varchar(128) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `total_xp` int(11) DEFAULT 0,
  `streak_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `unlocked_level` int(11) DEFAULT 1,
  `password` varchar(255) DEFAULT '123456'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `auth_uid`, `name`, `email`, `total_xp`, `streak_count`, `created_at`, `unlocked_level`, `password`) VALUES
(1, '', 'Explorer', 'explorer@gmail.com', 0, 0, '2026-11-05 18:26:17', 1, '123456'),
(20, '', 'Naura Ayu', 'naura@gmail.com', 0, 0, '2026-11-06 16:39:09', 1, '1234'),
(21, '', 'Marselino Ferdinan', 'marselino@gmail.com', 0, 0, '2026-11-06 17:11:02', 1, '2222'),
(22, '', 'Dilan Milea', 'dilan@gmail.com', 0, 0, '2026-11-06 17:26:48', 1, '123456');

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

CREATE TABLE `user_achievements` (
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `earned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_progress`
--

CREATE TABLE `user_progress` (
  `progress_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `completion_status` enum('NOT_STARTED','IN_PROGRESS','COMPLETED') DEFAULT 'NOT_STARTED',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`achievement_id`);

--
-- Indexes for table `flashcards`
--
ALTER TABLE `flashcards`
  ADD PRIMARY KEY (`flashcard_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `flashcard_reviews`
--
ALTER TABLE `flashcard_reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `flashcard_id` (`flashcard_id`);

--
-- Indexes for table `learning_levels`
--
ALTER TABLE `learning_levels`
  ADD PRIMARY KEY (`level_id`),
  ADD UNIQUE KEY `level_order` (`level_order`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`lesson_id`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `attempt_id` (`attempt_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD PRIMARY KEY (`attempt_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD PRIMARY KEY (`recommendation_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- Indexes for table `simulation_attempts`
--
ALTER TABLE `simulation_attempts`
  ADD PRIMARY KEY (`attempt_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `scenario_id` (`scenario_id`);

--
-- Indexes for table `simulation_scenarios`
--
ALTER TABLE `simulation_scenarios`
  ADD PRIMARY KEY (`scenario_id`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`user_id`,`achievement_id`),
  ADD KEY `achievement_id` (`achievement_id`);

--
-- Indexes for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `achievement_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `flashcards`
--
ALTER TABLE `flashcards`
  MODIFY `flashcard_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `flashcard_reviews`
--
ALTER TABLE `flashcard_reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `learning_levels`
--
ALTER TABLE `learning_levels`
  MODIFY `level_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `lesson_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  MODIFY `attempt_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `recommendations`
--
ALTER TABLE `recommendations`
  MODIFY `recommendation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `simulation_attempts`
--
ALTER TABLE `simulation_attempts`
  MODIFY `attempt_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `simulation_scenarios`
--
ALTER TABLE `simulation_scenarios`
  MODIFY `scenario_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `progress_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `flashcards`
--
ALTER TABLE `flashcards`
  ADD CONSTRAINT `flashcards_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE;

--
-- Constraints for table `flashcard_reviews`
--
ALTER TABLE `flashcard_reviews`
  ADD CONSTRAINT `flashcard_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `flashcard_reviews_ibfk_2` FOREIGN KEY (`flashcard_id`) REFERENCES `flashcards` (`flashcard_id`) ON DELETE CASCADE;

--
-- Constraints for table `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `learning_levels` (`level_id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_answers`
--
ALTER TABLE `quiz_answers`
  ADD CONSTRAINT `quiz_answers_ibfk_1` FOREIGN KEY (`attempt_id`) REFERENCES `quiz_attempts` (`attempt_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`question_id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_attempts`
--
ALTER TABLE `quiz_attempts`
  ADD CONSTRAINT `quiz_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `quiz_attempts_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE;

--
-- Constraints for table `recommendations`
--
ALTER TABLE `recommendations`
  ADD CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `recommendations_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE;

--
-- Constraints for table `simulation_attempts`
--
ALTER TABLE `simulation_attempts`
  ADD CONSTRAINT `simulation_attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `simulation_attempts_ibfk_2` FOREIGN KEY (`scenario_id`) REFERENCES `simulation_scenarios` (`scenario_id`) ON DELETE CASCADE;

--
-- Constraints for table `simulation_scenarios`
--
ALTER TABLE `simulation_scenarios`
  ADD CONSTRAINT `simulation_scenarios_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `learning_levels` (`level_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`achievement_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`lesson_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
