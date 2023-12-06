
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
    getFirestore, 
    doc, setDoc, addDoc, updateDoc, deleteDoc, Timestamp,
    collection, query, getDocs, orderBy, limit
} 
from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: "AIzaSyBOj2XnXj4DgiT8SNuXBhKOWD-WM4lAXLQ",
  authDomain: "arifaina-14e4c.firebaseapp.com",
  projectId: "arifaina-14e4c",
  storageBucket: "arifaina-14e4c.appspot.com",
  messagingSenderId: "785914910165",
  appId: "1:785914910165:web:ac27faed14afb0ef82d95c"
};

const app = initializeApp(firebaseConfig),
      db = getFirestore(app);

async function store(collect, key, value) {
    value.updated_at = Timestamp.fromDate(new Date());

    if (key) { await setDoc(doc(db, collect, key), value); }
    else { await addDoc(collection(db, collect), value); }
}

async function update(collect, key, value) {
    const id = doc(db, collect, key);

    value.updatedAt = Timestamp.fromDate(new Date());

    await updateDoc(id, value);
}

async function remove(collect, key) {
    await deleteDoc(doc(db, collect, key));
}

async function fetch(collect, count) {
    const q = query(collection(db, collect), orderBy("updated_at", "desc"), limit(count));

    return await getDocs(q);
}

export default { 
    store: store,
    update: update,
    remove: remove,
    fetch: fetch
}