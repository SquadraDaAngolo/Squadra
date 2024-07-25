import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNhNEds07ER6ZbdEdPQMFI4M_gpM9LhBU",
    authDomain: "squadradangolo-534cd.firebaseapp.com",
    projectId: "squadradangolo-534cd",
    storageBucket: "squadradangolo-534cd.appspot.com",
    messagingSenderId: "243172279017",
    appId: "1:243172279017:web:df84e77a473b2b66192678"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function displayUsers() {
    const usersList = document.getElementById('usersList');
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);

    userSnapshot.forEach(doc => {
        const { firstName, lastName, email, numero, citta, servizi } = doc.data();
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
            <strong>Name:</strong> ${firstName} ${lastName} <br>
            <strong>Email:</strong> ${email} <br>
            <strong>Phone:</strong> ${numero} <br>
            <strong>City:</strong> ${citta} <br>
            <strong>Services:</strong> ${servizi} <br>
            <a href = "tel:${numero}" class="chiama">${numero}</a>
            <br>
        `;
        usersList.appendChild(userDiv);
    }); 
}

document.addEventListener('DOMContentLoaded', displayUsers);

function toggleMenu() {
    document.querySelector('.menu').classList.toggle('show');
}
