import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

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

  const auth=getAuth();
  const db=getFirestore();

  onAuthStateChanged(auth, (user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                document.getElementById('loggedUserFName1').innerText=userData.firstName;
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;
                document.getElementById('loggedUserfServizi').innerText=userData.servizi;
                document.getElementById('loggedUserfNumero').innerText=userData.numero;
                document.getElementById('loggedUserfCitta').innerText=userData.citta;
            }
            else{
                console.log("no document found matching id")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='/login/index.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })