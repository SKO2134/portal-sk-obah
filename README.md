# Portal Digital SK Obah v4

Versi ini mempunyai portal awam dan panel pentadbir sebenar berasaskan Firebase.

## Boleh diurus melalui panel web
- Profil sekolah
- Pengumuman: tambah, edit dan padam
- Quick Access: tambah, edit, tutup dan padam
- Aktiviti/galeri: muat naik, lulus dan padam
- Paparan jumlah kandungan dan item menunggu kelulusan

## Fail utama
- `index.html` — portal awam
- `admin.html` — panel pentadbir/guru
- `assets/firebase-config.js` — konfigurasi Firebase
- `firestore.rules` dan `storage.rules` — peraturan keselamatan
- `PANDUAN-FIREBASE.md` — pemasangan langkah demi langkah

Tanpa Firebase, portal awam masih boleh dibuka tetapi fungsi simpan/edit dalam panel tidak aktif.
