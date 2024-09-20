const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS to allow requests from your frontend (React app)
app.use(cors());

// Function to generate the filename with date and original filename
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = date.getFullYear();

    // Remove special characters from the original file name
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
    const newFilename = `${month}${day}${year}-${sanitizedOriginalName}`;
    
    cb(null, newFilename);
  },
});

// Set up multer for file uploads (files will be stored in 'uploads' folder)
const upload = multer({ storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload endpoint
app.post('/uploadFile', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    console.log('Uploaded file:', req.file); // Log the uploaded file information

    // Respond with the path of the uploaded file
    res.json({ file: `/uploads/${req.file.filename}` });
});

// Add this route to your existing server.js file
app.get('/', (req, res) => {
    res.send('Welcome to the File Upload API!');
});

// Start the server on port 5001
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


