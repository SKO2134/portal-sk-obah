// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBxCFFvWGt9IolammKfPvey4BTtW1R74Yw",
  authDomain: "portal-sk-obah.firebaseapp.com",
  projectId: "portal-sk-obah",
  storageBucket: "portal-sk-obah.firebasestorage.app",
  messagingSenderId: "619227114253",
  appId: "1:619227114253:web:624a83c4753e0c1d129e44"
};
export const firebaseReady =
  !Object.values(firebaseConfig).some(
    v => String(v).includes("PASTE_")
  );
