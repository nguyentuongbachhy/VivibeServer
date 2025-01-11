// Import the functions you need from the SDKs you need
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';



const serviceAccount = require('./firebase-admin.json')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB89tvlW-KEXMWNIXN8stqvOgkXkwsRKHE",
    authDomain: "vivibe-108ba.firebaseapp.com",
    projectId: "vivibe-108ba",
    storageBucket: "vivibe-108ba.firebasestorage.app",
    messagingSenderId: "126631239702",
    appId: "1:126631239702:web:707763306c53a41798d537",
    measurementId: "G-75GF9XF2MF"
};

// Initialize Firebase
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: firebaseConfig.storageBucket
});

const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

db.settings({
    timestampsInSnapshots: true,
    ignoreUndefinedProperties: true
})

const collections = {
    songs: db.collection('songs'),
    artists: db.collection('artists'),
    genres: db.collection('genres'),
    songGenres: db.collection('songGenres'),
    users: db.collection('users'),
}

const serverTimestamp = () => admin.firestore.FieldValue.serverTimestamp()
const increment = (number) => admin.firestore.FieldValue.increment(number)
const arrayUnion = (element) => admin.firestore.FieldValue.arrayUnion(element)
const arrayRemove = (element) => admin.firestore.FieldValue.arrayRemove(element)

export {
    app, arrayRemove, arrayUnion, auth, collections, db, increment, serverTimestamp, storage
};

