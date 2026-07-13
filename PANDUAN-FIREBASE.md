# Panduan Firebase — Portal SK Obah v4

## 1. Cipta projek
Buka Firebase Console, pilih **Add project**, beri nama `portal-sk-obah`.

## 2. Daftar aplikasi Web
Di Project Overview, tekan ikon `</>`, daftar aplikasi. Salin objek `firebaseConfig` ke `assets/firebase-config.js` dan ubah `firebaseReady` kepada `true`.

## 3. Aktifkan Authentication
Authentication → Get started → Sign-in method → aktifkan **Email/Password**.

## 4. Cipta akaun admin
Authentication → Users → Add user. Masukkan e-mel dan kata laluan anda. Salin UID akaun tersebut.

## 5. Aktifkan Firestore
Firestore Database → Create database. Selepas siap, buka koleksi `users`, cipta dokumen menggunakan UID admin sebagai Document ID. Masukkan:
- `name` (string): `Jerremaya Jeffry`
- `role` (string): `admin`

## 6. Pasang Firestore Rules
Salin seluruh kandungan `firestore.rules` ke Firestore → Rules → Publish.

## 7. Aktifkan Storage
Storage → Get started. Salin kandungan `storage.rules` ke Storage → Rules → Publish. Firebase mungkin meminta billing untuk Storage bergantung pada akaun/region semasa.

## 8. Muat naik ke GitHub
Muat naik semua fail dan folder dalam pakej ini ke repositori `portal-sk-obah`, kemudian Commit changes.

## 9. Buka panel
Portal awam: `https://sko2134.github.io/portal-sk-obah/`
Panel: `https://sko2134.github.io/portal-sk-obah/admin.html`

## Peranan
- `admin`: semua modul
- `gb`: pengurusan kandungan
- `pkpentadbiran`: pengurusan kandungan
- `pkkoku`: pengurusan kandungan
- `pkhem`: pengurusan kandungan
- `teacher`: muat naik aktiviti untuk kelulusan

Jangan simpan data peribadi murid atau dokumen sulit pada paparan awam.
