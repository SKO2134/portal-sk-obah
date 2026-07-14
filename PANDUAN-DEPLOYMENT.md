# Panduan Deployment Portal Digital SK Obah

## 1. Masukkan konfigurasi Firebase

Firebase Console → Project settings → Your apps → Portal SK Obah → SDK setup and configuration.

Buka `assets/firebase-config.js` dan gantikan semua nilai `PASTE_...` dengan konfigurasi Web App anda. Konfigurasi ini bukan kata laluan; akses data tetap dikawal oleh Firebase Rules.

## 2. Authentication

Firebase Console → Authentication → Sign-in method → aktifkan Email/Password.

Cipta akaun melalui Authentication → Users → Add user. Kemudian di Firestore, cipta dokumen `users/{UID}`:

```
name: "Nama Pengguna"
role: "admin"
status: "active"
```

Peranan sah: `admin`, `gb`, `pk_pentadbiran`, `pk_kurikulum`, `pk_kokurikulum`, `pk_hem`, `guru`.

## 3. Firestore Rules

Firebase Console → Firestore Database → Rules. Salin keseluruhan kandungan `firestore.rules`, kemudian tekan Publish.

Jika Firestore meminta index, buka pautan yang diberi dalam mesej ralat dan cipta index tersebut. Query portal menggunakan gabungan `published/status/section` dengan `createdAt/order`.

## 4. Storage Rules

Aktifkan Cloud Storage hanya jika projek anda mempunyai bucket. Firebase Console → Storage → Rules. Salin kandungan `storage.rules`, kemudian tekan Publish.

Portal menerima JPG, PNG atau WebP sehingga 5MB. Jika Storage tidak diaktifkan, fungsi teks masih berjalan tetapi muat naik banner dan galeri tidak akan berfungsi.

## 5. Facebook rasmi dan kandungan

Log masuk di `admin.html` → Profil & Banner → tampal pautan Facebook rasmi → Simpan Profil.

Admin boleh mengurus semua modul. PK hanya boleh mengurus bahagian yang dibenarkan. Guru boleh menghantar aktiviti; kiriman guru berstatus `pending` sehingga diluluskan.

## 6. GitHub Pages

Salin semua fail portal ke root repositori `portal-sk-obah`. Dalam GitHub Desktop, Commit kemudian Push origin. Di GitHub: Settings → Pages → Deploy from a branch → `main` → `/(root)`.

Portal awam: `https://sko2134.github.io/portal-sk-obah/`

Panel: `https://sko2134.github.io/portal-sk-obah/admin.html`

## 7. Semakan sebelum pelancaran

- Uji portal awam dalam telefon dan komputer.
- Uji akaun admin, setiap PK, dan satu akaun guru.
- Pastikan guru tidak boleh edit bahagian lain.
- Uji aktiviti guru → pending → lulus → muncul di galeri.
- Jangan terbitkan data peribadi murid atau dokumen dalaman.
