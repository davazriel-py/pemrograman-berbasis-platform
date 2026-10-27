// SEMUA data undangan ada di sini. Saat ini berisi DATA CONTOH untuk preview; ganti dengan data asli.
// Foto: isi "src" (mis. "img/foto1.jpg"). Kosong = tampil placeholder.
const WEDDING = {
  groom: { full: 'Raka Pratama, S.Kom.', nick: 'Raka', parents: 'Bapak Hendra Pratama & Ibu Sari Wulandari', photo: 'img/groom.svg' },
  bride: { full: 'Aira Maharani, S.Ds.', nick: 'Aira', parents: 'Bapak Wahyu Santoso & Ibu Dewi Lestari', photo: 'img/bride.svg' },
  dateLabel: 'Sabtu, 23 Januari 2027',
  dateISO: '2027-01-23T08:00:00+07:00', // kosong = countdown belum aktif
  coverPhoto: 'img/cover.svg',
  musicSrc: 'audio/untilifoundyou.mp3',       // contoh: 'audio/lagu.mp3'
  rsvpEndpoint: 'https://formspree.io/f/mkjjjeav',   // URL Formspree / Firebase Function / Apps Script. Kosong = belum terhubung
  maxGuests: 5,
  story: [
    { title: 'Pertama Bertemu', date: '2021', text: 'Kami bertemu di sebuah acara komunitas kampus. Obrolan singkat tentang kopi dan musik ternyata berlanjut sampai larut malam.', photo: 'img/story1.svg' },
    { title: 'Mulai Menjalin Hubungan', date: '2023', text: 'Setelah dua tahun berteman baik, kami sadar bahwa tempat paling nyaman untuk pulang adalah satu sama lain.', photo: 'img/story2.svg' },
    { title: 'Momen Berkesan', date: '2025', text: 'Di tepi pantai saat matahari terbenam, Raka melamar Aira dengan restu kedua keluarga.', photo: 'img/story3.svg' },
    { title: 'Menuju Pernikahan', date: '2027', text: 'Dengan doa dan restu, kami siap memulai perjalanan baru dan ingin Anda hadir berbagi kebahagiaan.', photo: 'img/story4.svg' }
  ],
  // Alamat contoh memakai lokasi nyata di Surabaya agar peta tampil. Ganti dengan lokasi acara Anda.
  events: [
    { id: 'akad', type: 'Akad Nikah', icon: '◈', date: 'Sabtu, 23 Januari 2027', time: '08.00 - 10.00 WIB', venue: 'Pojokopi',
      address: 'Wisma Sejahtera Surabaya, Jl. Ketintang Sel. No.77, Karah, Kec. Jambangan', city: 'Surabaya, Jawa Timur', note: 'Dekat Masjid Baitussalam', lat: -7.316671, lng: 112.7214156, mapsUrl: 'https://maps.app.goo.gl/NnjKF5eFx9Zmv4y99' },
    { id: 'resepsi', type: 'Resepsi', icon: '✦', date: 'Sabtu, 23 Januari 2027', time: '11.00 - 14.00 WIB', venue: 'Hotel Majapahit Surabaya',
      address: 'Jl. Tunjungan No.65, Genteng', city: 'Surabaya, Jawa Timur', note: 'Berada di kawasan Tunjungan, mudah dijangkau kendaraan online.', lat: null, lng: null, mapsUrl: '' }
  ],
  gallery: [
    { src: 'img/gallery1.svg', ratio: '3 / 4' }, { src: 'img/gallery2.svg', ratio: '1 / 1' }, { src: 'img/gallery3.svg', ratio: '4 / 5' },
    { src: 'img/gallery4.svg', ratio: '4 / 3' }, { src: 'img/gallery5.svg', ratio: '3 / 4' }, { src: 'img/gallery6.svg', ratio: '1 / 1' }
  ]
};
