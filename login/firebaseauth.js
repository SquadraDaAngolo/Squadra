 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
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

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }
 const signUp=document.getElementById('submitSignUp');
 signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;
    const servizi = document.getElementById('fServizi').value;
    const eta = document.getElementById('fEta').value;
    const numero = document.getElementById('fNumero').value;
    const regione = document.getElementById('fRegione').value;
    const citta = document.getElementById('fCitta').value;
    const paypal = document.getElementById('paypal-button-container-P-5N260480SF447990XM2KDDBY').value;
    const checkbox = document.getElementById('checkbox').value;
    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            firstName: firstName,
            lastName:lastName,
            email: email,
            eta:eta,
            numero:numero,
            servizi:servizi,
            citta:citta,
            regione:regione,
            paypal:paypal,
            checkbox:checkbox
        };
        showMessage('Account creato con successo', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='index.html';
        })
        .catch((error)=>{
            console.error("errore nella scrittura del documento", error);

        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage("L'indirizzo email è già esistente !!!", 'signUpMessage');
        }
        else{
            showMessage("impossibile creare l'utente", 'signUpMessage');
        }
    })
 });

 const signIn=document.getElementById('submitSignIn');
 signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage("l'accesso è riuscito", 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='/lavora/homepage.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Email o password errati', 'signInMessage');
        }
        else{
            showMessage("L'account non esiste", 'signInMessage');
        }
    })
 })
