import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBJbMXNUgztynfpNDk1-gILgPVTNN2FzRk",
  authDomain: "whatsapp-clone-eac94.firebaseapp.com",
  projectId: "whatsapp-clone-eac94",
  storageBucket: "whatsapp-clone-eac94.appspot.com",
  messagingSenderId: "953648618661",
  appId: "1:953648618661:web:a110bc350e65862013014c",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
