import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
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

// Function to display users
async function displayUsers() {
    const usersList = document.getElementById('usersList');
    const usersCollection = collection(db, "users");
    const userSnapshot = await getDocs(usersCollection);

    userSnapshot.forEach(doc => {
        const { firstName, lastName, email, numero, citta, servizi, photoURL, description } = doc.data();
        const userDiv = document.createElement('div');

        // When the user clicks on the div, open the modal with details
        userDiv.onclick = () => {
            openModal(doc.id);
        };

        // Display user data along with profile picture, text, and social media links
        userDiv.innerHTML = `
            <strong>Nome:</strong> ${firstName} ${lastName} <br>
            <strong>Email:</strong> ${email} <br>
            <strong>Telefono:</strong> ${numero} <br>
            <strong>Città:</strong> ${citta} <br>
            <strong>Servizi:</strong> ${servizi} <br>
            <img src="${photoURL}" alt="Foto Utente" style="max-width: 100px; border-radius: 50%;"> <br>
            <strong>Descrizione:</strong> ${description || 'Nessuna descrizione disponibile'} <br>
        `;
        
        usersList.appendChild(userDiv);
    });
}

// Call the displayUsers function after the page has loaded
document.addEventListener('DOMContentLoaded', displayUsers);

// Function to open the modal and load user details, including work images
async function openModal(workerId) {
    const modal = document.getElementById('workerModal');
    const workerDetails = document.getElementById('workerDetails');
    const workImagesContainer = document.getElementById('workImagesContainer');

    // Retrieve the user data from Firestore using workerId
    const workerDocRef = doc(db, "users", workerId);
    const workerDoc = await getDoc(workerDocRef);

    if (workerDoc.exists()) {
        const { firstName, lastName, email, numero, citta, servizi, photoURL, description, workImages } = workerDoc.data();
        
        workerDetails.innerHTML = `
            <h2 style="font-size: 24px; text-align: center;">Dettagli per ${firstName} ${lastName}</h2>
            <strong style="font-size: 22px;">Email:</strong> <span style="font-size: 22px;">${email}</span> <br>
            <strong style="font-size: 22px;">Telefono:</strong> <span style="font-size: 22px;">${numero}</span> <br>
            <strong style="font-size: 22px;">Città:</strong> <span style="font-size: 22px;">${citta}</span> <br>
            <strong style="font-size: 22px;">Servizi:</strong> <span style="font-size: 22px;">${servizi}</span> <br>
            <strong style="font-size: 22px;">Descrizione:</strong> <span style="font-size: 22px;">${description || 'Nessuna descrizione disponibile'}</span> <br>
            <img src="${photoURL}" alt="Foto Utente" class="worker-photo"> <br>
        `;

        // Clear any previous images
        workImagesContainer.innerHTML = '';

        // If the user has uploaded work images, display them
        if (workImages && workImages.length > 0) {
            workImages.forEach(imageURL => {
                const imgElement = document.createElement('img');
                imgElement.src = imageURL;
                imgElement.style.maxWidth = '150px';
                imgElement.style.margin = '10px';
                workImagesContainer.appendChild(imgElement);
            });
        } else {
            workImagesContainer.innerHTML = '<p>No work images available.</p>';
        }

        modal.style.display = 'block'; // Show the modal
    } else {
        workerDetails.innerHTML = 'Dettagli dell\'utente non trovati.';
        modal.style.display = 'block';
    }
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('workerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Add event listener for the close button ('X')
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.getElementById('closeModalButton');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Close the modal if the user clicks outside the modal window
    window.onclick = function(event) {
        const modal = document.getElementById('workerModal');
        if (event.target === modal) {
            closeModal();
        }
    };
});
