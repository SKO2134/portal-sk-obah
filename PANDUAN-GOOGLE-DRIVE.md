# Google Drive sebagai simpanan Galeri

Firebase Authentication kekal mengawal log masuk. Firestore menyimpan tajuk, keterangan, status dan pautan gambar. Fail gambar disimpan dalam satu folder Google Drive.

## 1. Cipta folder Drive

1. Dalam Google Drive sekolah, cipta folder `Galeri Portal SK Obah`.
2. Salin ID folder daripada URL selepas `folders/`.
3. Pastikan akaun Google yang membina Apps Script ialah pemilik folder.

## 2. Cipta Google Apps Script

1. Buka https://script.google.com dan cipta projek baharu.
2. Salin seluruh kandungan `google-drive-upload.gs` ke fail `Code.gs`.
3. Buka **Project Settings → Script Properties** dan tambah:
   - `DRIVE_FOLDER_ID`: ID folder Drive.
   - `FIREBASE_API_KEY`: nilai `apiKey` dalam `assets/firebase-config.js`.
   - `FIREBASE_PROJECT_ID`: `portal-sk-obah`.

## 3. Deploy Web App

1. Klik **Deploy → New deployment → Web app**.
2. **Execute as:** Me.
3. **Who has access:** Anyone.
4. Authorize akses Drive, kemudian salin URL yang berakhir dengan `/exec`.
5. Tampal URL itu ke `assets/google-drive-config.js`.

Walaupun Web App boleh dicapai umum, setiap permintaan mesti membawa token Firebase yang sah dan akaun mesti mempunyai `status: active` dalam Firestore.

## 4. Terbitkan portal

Commit dan push perubahan ke GitHub Pages. Log masuk Panel Guru dan uji satu gambar JPG/PNG/WebP di bawah 5MB. Kiriman guru akan berstatus `pending`; Admin atau PK berkenaan perlu meluluskannya.

Jika kod Apps Script diubah kemudian, pilih **Deploy → Manage deployments → Edit → New version → Deploy**. URL `/exec` kekal sama.
