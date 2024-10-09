const firebaseConfig = {
    apiKey: "AIzaSyBNhNEds07ER6ZbdEdPQMFI4M_gpM9LhBU",
    authDomain: "squadradangolo-534cd.firebaseapp.com",
    projectId: "squadradangolo-534cd",
    storageBucket: "squadradangolo-534cd.appspot.com",
    messagingSenderId: "243172279017",
    appId: "1:243172279017:web:df84e77a473b2b66192678"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var storage = firebase.storage();  // Initialize Firebase storage

// Profile picture upload variables
var fileText = document.querySelector(".fileText");
var uploadPercentage = document.querySelector(".uploadPercentage");
var progress = document.querySelector(".progress");
var img = document.querySelector(".img");

// Work images upload variables
const workImagesInput = document.getElementById('workImagesInput');
const uploadImagesButton = document.getElementById('uploadImagesButton');
const workUploadStatus = document.getElementById('uploadStatus');

// Other elements (description, social media)
const userDescriptionElement = document.getElementById("userDescription");
const instagramUsernameElement = document.getElementById("instagramUsername");
const facebookUsernameElement = document.getElementById("facebookUsername");

var fileItem;
var fileName;

// Function to handle profile picture selection
function getFile(e) {
    fileItem = e.target.files[0];
    fileName = fileItem ? fileItem.name : "No file selected";
    fileText.innerHTML = fileName;
}

// Function to upload a profile picture
function uploadImage() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You must be logged in to upload an image.");
        return;
    }
    let storageRef = storage.ref("profileImages/" + user.uid + "/" + fileName);
    let uploadTask = storageRef.put(fileItem);

    uploadTask.on("state_changed", (snapshot) => {
        let percentVal = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        uploadPercentage.innerHTML = percentVal + "%";
        progress.style.width = percentVal + "%";
    }, (error) => {
        console.log("Error uploading profile image:", error);
    }, async () => {
        const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
        img.setAttribute("src", imageUrl);
        img.style.display = "block";

        // Save the profile image URL to Firestore
        saveToFirestore(user.uid, null, imageUrl, null, null);
    });
}

// Function to upload multiple work images
async function uploadWorkImages() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You must be logged in to upload work images.");
        return;
    }

    const userId = user.uid;
    const files = workImagesInput.files;

    if (files.length === 0) {
        alert('No work images selected!');
        return;
    }

    try {
        const uploadPromises = Array.from(files).map((file) => {
            let workStorageRef = storage.ref(`workImages/${userId}/${file.name}`);
            return workStorageRef.put(file).then(async (snapshot) => {
                return snapshot.ref.getDownloadURL();
            });
        });

        const workImageUrls = await Promise.all(uploadPromises);

        // Store work image URLs in Firestore under the user's document
        const userDocRef = db.collection('users').doc(userId);
        await userDocRef.update({
            workImages: firebase.firestore.FieldValue.arrayUnion(...workImageUrls)
        });

        workUploadStatus.textContent = 'Work images uploaded successfully!';
    } catch (error) {
        console.error('Error uploading work images:', error);
        workUploadStatus.textContent = 'Error uploading work images. Please try again.';
    }
}

// Event listener for uploading work images
uploadImagesButton.addEventListener('click', uploadWorkImages);

// Function to upload text (description) to Firestore
function uploadText() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You must be logged in to save your description.");
        return;
    }

    const description = userDescriptionElement.value;
    saveToFirestore(user.uid, description, null, null, null);
}

// Function to save text, image, and social media data to Firestore
function saveData() {}

// Function to upload a profile picture or save text and social media data
function uploadImageAndSaveText(user, description) {
    if (fileItem) {
        let storageRef = storage.ref("profileImages/" + user.uid + "/" + fileItem.name);
        let uploadTask = storageRef.put(fileItem);

        uploadTask.on("state_changed", (snapshot) => {
            let percentVal = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            uploadPercentage.innerHTML = percentVal + "%";
            progress.style.width = percentVal + "%";
        }, (error) => {
            console.log("Error uploading profile image:", error);
        }, async () => {
            const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
            img.setAttribute("src", imageUrl);
            img.style.display = "block";

            // Save image URL and other data to Firestore
            saveToFirestore(user.uid, description, imageUrl);
        });
    } else {
        // Save just the text and social media data
        saveToFirestore(user.uid, description, null);
    }
}

// Function to save user data (description, image URL, social media) to Firestore
function saveToFirestore(userId, description, imageUrl) {
    const userDocRef = db.collection('users').doc(userId);

    const updateData = {};
    if (description) updateData.description = description;
    if (imageUrl) updateData.photoURL = imageUrl;
    
    userDocRef.update(updateData).then(() => {
        alert('Data saved successfully!');
    }).catch((error) => {
        console.error("Error saving data:", error);
    });
}

// Event listeners for save buttons
document.querySelector('.upload').addEventListener('click', uploadText);
document.querySelector('.butto').addEventListener('click', saveData);

// Function to load work images from Firestore and display them
function loadWorkImages() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("Devi essere loggato per visualizzare le immagini.");
        return;
    }

    const userId = user.uid;
    const userDocRef = db.collection('users').doc(userId);

    userDocRef.get().then((doc) => {
        if (doc.exists && doc.data().workImages) {
            const workImages = doc.data().workImages;
            const sidebar = document.querySelector('.work-image-sidebar');

            // Clear previous images
            sidebar.innerHTML = '';

            // Display each work image in the sidebar
            workImages.forEach((imageUrl) => {
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = "Work Image";
                imgElement.classList.add('work-image');  // Add a class for styling
                sidebar.appendChild(imgElement);
            });
        } else {
            console.log("No work images found.");
        }
    }).catch((error) => {
        console.error("Error fetching work images:", error);
    });
}

// Call this function when the page loads to display the images
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadWorkImages();
    }
});

// Function to load work images from Firestore and display them with a delete button
function loadWorkImages() {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("Devi essere loggato per visualizzare le immagini.");
        return;
    }

    const userId = user.uid;
    const userDocRef = db.collection('users').doc(userId);

    userDocRef.get().then((doc) => {
        if (doc.exists && doc.data().workImages) {
            const workImages = doc.data().workImages;
            const sidebar = document.querySelector('.work-image-sidebar');

            // Clear previous images
            sidebar.innerHTML = '';

            // Display each work image in the sidebar with a delete button
            workImages.forEach((imageUrl, index) => {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('img-container');

                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = "Work Image";
                imgElement.classList.add('work-image');

                // Create delete button
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = 'X';
                deleteButton.classList.add('delete-button');
                deleteButton.addEventListener('click', () => {
                    deleteImage(userId, imageUrl);
                });

                // Append the image and delete button to the container
                imgContainer.appendChild(imgElement);
                imgContainer.appendChild(deleteButton);

                // Append the container to the sidebar
                sidebar.appendChild(imgContainer);
            });
        } else {
            console.log("No work images found.");
        }
    }).catch((error) => {
        console.error("Error fetching work images:", error);
    });
}

// Function to delete an image from Firebase Storage and Firestore
function deleteImage(userId, imageUrl) {
    const storageRef = storage.refFromURL(imageUrl);  // Get a reference to the image in Firebase Storage

    // Delete the image from Firebase Storage
    storageRef.delete().then(() => {
        console.log("Image deleted from Storage:", imageUrl);

        // Remove the image URL from the Firestore document
        const userDocRef = db.collection('users').doc(userId);
        userDocRef.update({
            workImages: firebase.firestore.FieldValue.arrayRemove(imageUrl)  // Remove the image URL from Firestore array
        }).then(() => {
            console.log("Image URL removed from Firestore:", imageUrl);
            alert('Immagine eliminata con successo!');

            // Reload the images after deletion
            loadWorkImages();
        }).catch((error) => {
            console.error("Error removing image URL from Firestore:", error);
        });
    }).catch((error) => {
        console.error("Error deleting image from Storage:", error);
    });
}

// Call this function when the page loads to display the images
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadWorkImages();
    }
});
