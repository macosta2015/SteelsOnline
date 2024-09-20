const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS to allow requests from your frontend (React app)
app.use(cors());

// Set up multer for file uploads (files will be stored in 'uploads' folder)
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload endpoint
app.post('/uploadFile', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }

    // Respond with the path of the uploaded file
    res.json({ file: `/uploads/${req.file.filename}` });
});

// Start the server on port 5000
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
