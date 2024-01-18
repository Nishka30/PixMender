// // Function to read image data from a URL
// function getImageDataFromURL(url, callback) {
//     var img = new Image();
  
//     // Set the crossOrigin property to handle cross-origin images
//     img.crossOrigin = "Anonymous";
  
//     img.onload = function() {
//       var canvas = document.createElement("canvas");
//       var ctx = canvas.getContext("2d");
  
//       // Set the canvas dimensions to match the image
//       canvas.width = img.width;
//       canvas.height = img.height;
  
//       // Draw the image onto the canvas
//       ctx.drawImage(img, 0, 0);
  
//       // Get the image data
//       var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
//       // Call the callback function with the image data
//       callback(imageData);
//     };
  
//     // Set the image source to the provided URL
//     img.src = url;
//   }
  
  
  
// var firebaseConfig = {
//   apiKey: "AIzaSyA6VQ3gKwl0sV9Bs3SzrjQ_O0Soow4hPdY",
//   authDomain: "imageupload-51b05.firebaseapp.com",
//   projectId: "imageupload-51b05",
//   storageBucket: "imageupload-51b05.appspot.com",
//   messagingSenderId: "379139073805",
//   appId: "1:379139073805:web:d2f62b6da917e67eedf244",
//   measurementId: "G-7W1KLDM1RV"
// };
// firebase.initializeApp(firebaseConfig);

// var storage = firebase.storage();

// var imagesRef = storage.ref("images");

// document.getElementById("imageInput").addEventListener("change", function(event) {
// 	var file = event.target.files[0];

// 	var imageRef = imagesRef.child(file.name);

// 	uploadImage(imageRef, file);
// });

// // Function to upload the image
// function uploadImage(imageRef, file) {
// 	// Upload the image to the storage
// 	imageRef.put(file).then(function(snapshot) {
// 		// Get the download URL of the image
// 		snapshot.ref.getDownloadURL().then(function(downloadURL) {
// 			sendToServer(downloadURL)
// 		});
        
        
// 	}).catch(function(error) {
// 		console.error("Error uploading image: " + error);
// 	});
// }



// function sendToServer(downloadURL) {
//     fetch('http://localhost:3000/uploadAndQuery', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ imageUrl: downloadURL }),
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       document.getElementById('result').innerText = JSON.stringify(data.result);
//     })
//     .catch(error => {
//       console.error('Error:', error);
//       document.getElementById('result').innerText = 'An error occurred while processing the image. Please try again.';
//     });
//   }

// main.js

// main.js

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
var file = fileInput.files[0];

if (file) {
  // Use FormData to send the file directly to the API
  var formData = new FormData();
  formData.append("file", file);

  // Make the API call
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
    // Check if the result array is not empty
    if (data.result && data.result.length > 0) {
      // Assuming the result array is sorted by score in descending order
      const highestScore = data.result[0].score;
      const highestLabel = data.result[0].label;

      if (highestScore > 0.5) {
        if (highestLabel === 'photo') {
          alert('The uploaded file is a PHOTOGRAPH.');
          uploadToFirebase('photo', file);
        } else if (highestLabel === 'signature') {
          alert('The uploaded file is a SIGNATURE.');
          uploadToFirebase('signature', file);
        }
      }
    }

    // document.getElementById('result').innerText = JSON.stringify(data.result);
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('result').innerText = 'An error occurred while processing the image. Please try again.';
  });
} else {
  console.error('No file selected.');
}
}

function uploadToFirebase(folder, file) {
var storage = firebase.storage();
var imagesRef = storage.ref(folder);

var imageRef = imagesRef.child(file.name);

// Upload the image to the respective folder in Firebase Storage
imageRef.put(file).then(function(snapshot) {
  snapshot.ref.getDownloadURL().then(function(downloadURL) {
    console.log(`Image uploaded successfully to ${folder} folder: ${downloadURL}`);
  });
}).catch(function(error) {
  console.error(`Error uploading image to ${folder} folder: ${error}`);
});
}

// Function to read image data from a URL
function getImageDataFromURL(url, callback) {
var img = new Image();

// Set the crossOrigin property to handle cross-origin images
img.crossOrigin = "Anonymous";

img.onload = function() {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  // Set the canvas dimensions to match the image
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image onto the canvas
  ctx.drawImage(img, 0, 0);

  // Get the image data
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Call the callback function with the image data
  callback(imageData);
};

// Set the image source to the provided URL
img.src = url;
}
