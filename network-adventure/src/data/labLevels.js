export const labLevels = [
  { 
    id: 1, 
    title: 'Hubungkan dua komputer', 
    desc: 'Pasang dua PC ke sebuah switch, lalu jalankan simulasi',
    requiredDevices: ['pc', 'switch']
  },
  { 
    id: 2, 
    title: 'Jaringan Antar Switch', 
    desc: 'Hubungkan dua switch untuk memperluas jaringan lokal',
    requiredDevices: ['switch', 'switch']
  },
  { 
    id: 3, 
    title: 'Gerbang Router', 
    desc: 'Tambahkan Router sebagai gateway penghubung beda jaringan',
    requiredDevices: ['router', 'switch', 'pc']
  },
  { 
    id: 4, 
    title: 'Pusat Server', 
    desc: 'Hubungkan PC dan Server melalui Switch utama',
    requiredDevices: ['pc', 'switch', 'server']
  },
  { 
    id: 5, 
    title: 'Konfigurasi Subnet', 
    desc: 'Susun topologi jaringan berskala sedang',
    requiredDevices: ['router', 'switch', 'pc', 'server']
  },
  { 
    id: 6, 
    title: 'Network Master', 
    desc: 'Rancang topologi kompleks lengkap dari PC ke Server',
    requiredDevices: ['pc', 'switch', 'router', 'server']
  },
];