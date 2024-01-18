

// const serviceAccount = require('../imageupload-51b05-firebase-adminsdk-kqzpz-2a54bc5e8c.json');
// const bucketName = 'gs://imageupload-51b05.appspot.com'; // Replace with your actual bucket name

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: bucketName,
// });
// const app = express();

// app.use(cors());
// app.use(bodyParser.json());

// app.post('/uploadAndQuery', async (req, res) => {
//   try {
//     const imageUrl = req.body.imageUrl;

//     // Run the query on the image
//     const result = await query(imageUrl);

//     // Return the result to the frontend
//     res.json({ result });
//   } catch (error) {
//     console.error('Error processing image:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // Function to run the query on the image
// async function query(firebaseStoragePath) {
//   try {
//     // Get a reference to the Firebase Storage bucket
//     const bucket = admin.storage().bucket();

//     // Construct the full URL for the image in Firebase Storage
//     const firebaseStorageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(firebaseStoragePath)}?alt=media`;

//     let result = null;
//     let elapsedTime = 0;
//     const maxElapsedTime = 28000; // Set the maximum elapsed time in milliseconds (30 seconds)

//     // Polling loop
//     while (elapsedTime < maxElapsedTime) {
//       // Wait for a certain period before making the next poll (e.g., 1 second)
//       await new Promise(resolve => setTimeout(resolve, 1000));

//       // Make the API call to Hugging Face
//       const response = await fetch(
//         'https://api-inference.huggingface.co/models/maurya22/photo_and_signature_classifier_model',
//         {
//           headers: {
//             Authorization: 'Bearer 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',
//             'Content-Type': 'application/json',
//           },
//           method: 'POST',
//           body: JSON.stringify({ imageUrl: firebaseStorageUrl }),
//         }
//       );

//       // Check if the response is successful and contains a valid result
//       if (response.ok) {
//         result = await response.json();

//         // Handle the incorrect response format
//         if (Array.isArray(result) && result.length > 0 && result[0].hasOwnProperty('score') && result[0].hasOwnProperty('label')) {
//           return result;
//         } else {
//           console.log('Incorrect response format. Fixing the response...');
//           result = {
//             result: [
//               {
//                 score: result.scores[0],
//                 label: result.labels[0],
//               },
//               {
//                 score: result.scores[1],
//                 label: result.labels[1],
//               },
//             ],
//           };
//         }
//       }

//       // Increment the elapsed time
//       elapsedTime += 1000; // Increment by the same amount as the polling interval
//     }

//     return result;
//   } catch (error) {
//     console.error('Error querying image:', error);
//     throw error;
//   }
// }

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// server.js

const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const serviceAccount = require('../imageupload-51b05-firebase-adminsdk-kqzpz-2a54bc5e8c.json');
const bucketName = 'gs://imageupload-51b05.appspot.com'; // Replace with your actual bucket name

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: bucketName,
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Set up multer for handling file uploads
const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

app.post('/uploadAndQuery', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Run the query on the image
    const result = await query(req.file.buffer);

    // Return the result to the frontend
    res.json({ result });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to run the query on the image
async function query(imageBuffer) {
  try {
    // Convert the imageBuffer to a format that your API expects (e.g., base64)
    const base64Image = imageBuffer.toString('base64');

    // Make the API call to Hugging Face
    const response = await fetch(
      'https://api-inference.huggingface.co/models/maurya22/photo_and_signature_classifier_model',
      {
        headers: {
          Authorization: 'Bearer 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',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ image: base64Image }),
      }
    );

    // Check if the response is successful and contains a valid result
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error(`API request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error querying image:', error);
    throw error;
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
