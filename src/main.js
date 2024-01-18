// Initialize Firebase
var firebaseConfig = {
	apiKey: "AIzaSyA6VQ3gKwl0sV9Bs3SzrjQ_O0Soow4hPdY",
  authDomain: "imageupload-51b05.firebaseapp.com",
  projectId: "imageupload-51b05",
  storageBucket: "imageupload-51b05.appspot.com",
  messagingSenderId: "379139073805",
  appId: "1:379139073805:web:d2f62b6da917e67eedf244",
  measurementId: "G-7W1KLDM1RV"
};
firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();

var imagesRef = storage.ref("images");

document.getElementById("imageInput").addEventListener("change", function(event) {
	var file = event.target.files[0];

	var imageRef = imagesRef.child(file.name);

	uploadImage(imageRef, file);
});

function uploadImage(imageRef, file) {
    var progressBar = document.getElementById("progressBar");
  
    imageRef.put(file).then(function(snapshot) {
      snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log("Image uploaded successfully: " + downloadURL);
  
        // Display an alert after successfully uploading the picture
        alert("Image uploaded successfully: " + downloadURL);
      });
    }).catch(function(error) {
      console.error("Error uploading image: " + error);
      alert("Error uploading image: " + error); // Display an alert in case of an error
    }).on("state_changed", function(snapshot) {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  
      progressBar.value = progress;
    });
  }
  