/** Backend Google Drive untuk Portal SK Obah. */
function doPost(e) {
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    var identity = verifyFirebaseUser_(body.token);
    if (body.action === 'delete') return json_(deleteFile_(body.fileId, identity, body.folderKey));
    return json_(uploadFile_(body, identity));
  } catch (error) {
    return json_({ ok: false, error: String(error.message || error) });
  }
}

function authorizeDrive() {
  var folder = getUploadFolder_('portal_media');
  var testFile = folder.createFile('ujian-portal-sk-obah.txt', 'Ujian akses tulis portal SK Obah');
  Logger.log('Akses baca dan tulis Google Drive berjaya: ' + folder.getName());
  testFile.setTrashed(true);
  return folder.getName();
}

function verifyFirebaseUser_(token) {
  if (!token) throw new Error('Token Firebase tidak diterima. Sila log masuk semula.');
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('FIREBASE_API_KEY');
  var projectId = props.getProperty('FIREBASE_PROJECT_ID');
  if (!apiKey || !projectId) throw new Error('Script Properties Firebase belum lengkap.');
  var authResponse = UrlFetchApp.fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + encodeURIComponent(apiKey), {
    method: 'post', contentType: 'application/json', payload: JSON.stringify({ idToken: token }), muteHttpExceptions: true
  });
  var authData = JSON.parse(authResponse.getContentText() || '{}');
  if (authResponse.getResponseCode() !== 200 || !authData.users || !authData.users[0]) throw new Error('Sesi log masuk tidak sah atau telah tamat.');
  var uid = authData.users[0].localId;
  var userUrl = 'https://firestore.googleapis.com/v1/projects/' + encodeURIComponent(projectId) + '/databases/(default)/documents/users/' + encodeURIComponent(uid);
  var userResponse = UrlFetchApp.fetch(userUrl, { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
  if (userResponse.getResponseCode() !== 200) throw new Error('Akaun tidak aktif atau tidak dibenarkan memuat naik.');
  var fields = (JSON.parse(userResponse.getContentText() || '{}').fields) || {};
  return { uid: uid, role: fields.role && fields.role.stringValue || 'guru' };
}

function uploadFile_(body, identity) {
  if (['image/jpeg','image/png','image/webp'].indexOf(body.mimeType) < 0) throw new Error('Gunakan gambar JPG, PNG atau WebP.');
  if (!body.base64) throw new Error('Data gambar tidak diterima.');
  var bytes = Utilities.base64Decode(body.base64);
  if (bytes.length > 5 * 1024 * 1024) throw new Error('Saiz gambar melebihi 5MB.');
  var folder = getUploadFolder_(body.folderKey);
  var safeName = String(body.fileName || ('aktiviti-' + Date.now())).replace(/[^a-zA-Z0-9._-]/g, '_');
  var file = folder.createFile(Utilities.newBlob(bytes, body.mimeType, Date.now() + '-' + safeName));
  file.setDescription('portal-sk-obah:' + identity.uid);
  return { ok: true, fileId: file.getId(), url: driveImageUrl_(file.getId()) };
}

function deleteFile_(fileId, identity, folderKey) {
  if (!fileId) throw new Error('ID fail tidak diterima.');
  var file = DriveApp.getFileById(fileId);
  var folder = getUploadFolder_(folderKey);
  var inFolder = false, parents = file.getParents();
  while (parents.hasNext()) if (parents.next().getId() === folder.getId()) inFolder = true;
  if (!inFolder) throw new Error('Fail bukan milik folder portal.');
  var managers = ['admin','gb','pk_pentadbiran','pk_kurikulum','pk_kokurikulum','pk_hem'];
  if (file.getDescription() !== 'portal-sk-obah:' + identity.uid && managers.indexOf(identity.role) < 0) throw new Error('Anda tidak dibenarkan memadam fail ini.');
  file.setTrashed(true);
  return { ok: true };
}

function getUploadFolder_(folderKey) {
  var props = PropertiesService.getScriptProperties(), id;
  if (folderKey === 'portal_media') id = props.getProperty('PORTAL_MEDIA_FOLDER_ID') || '1okSDn88WJNYUSQe7YZB6C7o2oaCs_wPq';
  else if (folderKey === 'pentadbiran') id = props.getProperty('PENTADBIRAN_FOLDER_ID');
  else id = props.getProperty('DRIVE_FOLDER_ID');
  if (!id) throw new Error('ID folder Google Drive belum ditetapkan.');
  return DriveApp.getFolderById(id);
}

function driveImageUrl_(fileId) {
  return 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(fileId) + '&sz=w2000';
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
