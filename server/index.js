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

app.post('/uploadAndQuery', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const promises = req.files.map(async (file) => {
      // Run the query on the image
      const result = await query(file.buffer);

      // Return the result to the frontend
      return { file: file.originalname, result };
    });

    const results = await Promise.all(promises);
    res.json(results);
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
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
