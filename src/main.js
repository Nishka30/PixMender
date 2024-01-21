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

function uploadImage() {
  var fileInput = document.getElementById("imageInput");
  var files = fileInput.files;

  if (files.length > 0) {
    var formData = new FormData();

    // Append each file to the formData and check file size
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      if (file.size <= 4 * 1024 * 1024) { // Check if the file size is within 4 MB
        formData.append("files", file);
      } else {
        console.error(`File ${file.name} exceeds the 4 MB size limit and will not be uploaded.`);
        alert("File size is more than 4MB. Please choose a smaller file.");
        return; // Exit the function if a file exceeds the limit
      }
    }

    // Proceed with uploading valid files
    if (formData.getAll("files").length > 0) {
      fetch('http://localhost:3000/uploadAndQuery', {
        method: 'POST',
        body: formData,
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Upload all files to Firebase
        uploadAllToFirebase(data, files);
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'An error occurred while processing the images. Please try again.';
      });
    } else {
      console.error('No valid files selected.');
    }
  } else {
    console.error('No files selected.');
  }
}
function processResultsAndUpload(data, files) {
  var imagePreviewContainer = document.getElementById("imagePreviewContainer");

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imagePreview = document.createElement("img");
    var caption = document.createElement("p");
    caption.className = "imageCaption";

    if (data[i] && data[i].result && data[i].result.length > 0) {
      // Process individual result
      const highestScore = data[i].result[0].score;
      const highestLabel = data[i].result[0].label;

      if (highestScore > 0.55) {
        if (highestLabel === 'photo') {
          caption.innerText = 'Photograph';
        } else if (highestLabel === 'signature') {
          caption.innerText = 'Signature';
        } else {
          // If neither "photo" nor "signature", assume it's an ID
          caption.innerText = 'ID';
        }
      } else {
        // If the score is not high enough, assume it's an ID
        caption.innerText = 'ID';
      }
    }

    // Display image preview
    imagePreview.src = URL.createObjectURL(file);
    imagePreviewContainer.appendChild(imagePreview);
    imagePreviewContainer.appendChild(caption);

    // Upload the image to Firebase Storage and get the download URL
    uploadAndFetchUrl(file, caption);
  }
}
function uploadAndFetchUrl(file, caption) {
  var storage = firebase.storage();
  var imagesRef = storage.ref("images");

  var imageRef = imagesRef.child(file.name);

  // Upload the image to Firebase Storage
  imageRef.put(file).then(function(snapshot) {
    // Get the download URL of the uploaded image
    snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log(`Image uploaded successfully: ${downloadURL}`);
      
      // Display the download URL (you can further process or use it as needed)
      var urlContainer = document.createElement("p");
      urlContainer.innerText = `Download URL: ${downloadURL}`;
      imagePreviewContainer.appendChild(urlContainer);
    });
  }).catch(function(error) {
    console.error(`Error uploading image: ${error}`);
    // Handle the error accordingly
  });
}


function uploadToFirebase(folder, file) {
  var storage = firebase.storage();
  var imagesRef = storage.ref(folder);

  var imageRef = imagesRef.child(file.name);

  // Upload the image to the respective folder in Firebase Storage
  imageRef.put(file).then(function(snapshot) {
    snapshot.ref.getDownloadURL().then(function(downloadURL) {
      console.log(`Image uploaded successfully to ${folder} folder: ${downloadURL}`);
      // Here you can further process the downloadURL or update your UI if needed
    });
  }).catch(function(error) {
    console.error(`Error uploading image to ${folder} folder: ${error}`);
    // Handle the error accordingly
  });
}

function uploadAllToFirebase(data, files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    if (data[i] && data[i].result && data[i].result.length > 0) {
      // Process individual result
      const highestScore = data[i].result[0].score;
      const highestLabel = data[i].result[0].label;

      if (highestScore > 0.55) {
        if (highestLabel === 'photo') {
          uploadToFirebase('photo', file);
        } else if (highestLabel === 'signature') {
          uploadToFirebase('signature', file);
        } else {
          // If neither "photo" nor "signature", assume it's an ID
          uploadToFirebase('id', file);
        }
      } else {
        // If the score is not high enough, assume it's an ID
        uploadToFirebase('id', file);
      }
    }
  }
  alert("All Files have been Uploaded")
}
