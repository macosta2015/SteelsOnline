const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Function to generate the filename with date and original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
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

  console.log('Uploaded file:', req.file);
  res.json({ file: `/uploads/${req.file.filename}` });
});

// Email saving endpoint
app.post('/saveEmail', (req, res) => {
  const { email } = req.body;
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: 'Invalid email format' });
  }

  // Save email to a file
  fs.appendFile('emails.txt', `${email}\n`, (err) => {
    if (err) {
      console.error('Error saving email:', err);
      return res.status(500).send({ message: 'Error saving email' });
    }
    res.send({ message: 'Email saved successfully' });
  });
});

// Endpoint to serve emails.txt
app.get('/emails.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'emails.txt'));
});

// Endpoint to handle email deletion
app.post('/deleteEmail', (req, res) => {
  const { emails } = req.body;  // Array of emails sent from the frontend

  // Write the updated emails array back to the file
  fs.writeFile('emails.txt', emails.join('\n'), 'utf8', (err) => {
    if (err) {
      console.error('Error deleting email:', err);
      return res.status(500).send({ message: 'Failed to update emails.txt' });
    }
    res.send({ message: 'Emails updated successfully' });
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the File Upload API!');
});

// Start the server on port 5001
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const app = express();

// // Middleware to parse JSON requests
// app.use(express.json()); // Add this line to parse JSON bodies
// app.use(cors());

// // Function to generate the filename with date and original filename
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     const date = new Date();
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
//     const newFilename = `${month}${day}${year}-${sanitizedOriginalName}`;
//     cb(null, newFilename);
//   },
// });

// // Set up multer for file uploads (files will be stored in 'uploads' folder)
// const upload = multer({ storage });

// // Serve static files from the 'uploads' folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // File upload endpoint
// app.post('/uploadFile', upload.single('file'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).send({ message: 'No file uploaded' });
//     }

//     console.log('Uploaded file:', req.file);
//     res.json({ file: `/uploads/${req.file.filename}` });
// });

// // Email saving endpoint
// app.post('/saveEmail', (req, res) => {
//   const { email } = req.body;
  
//   // Validate email
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).send({ message: 'Invalid email format' });
//   }

//   // Save email to a file
//   fs.appendFile('emails.txt', `${email}\n`, (err) => {
//     if (err) {
//       console.error('Error saving email:', err);
//       return res.status(500).send({ message: 'Error saving email' });
//     }
//     res.send({ message: 'Email saved successfully' });
//   });
// });




// // Add this to your server.js
// app.get('/emails.txt', (req, res) => {
//   res.sendFile(path.join(__dirname, 'emails.txt'));
// });


// // Root route
// app.get('/', (req, res) => {
//     res.send('Welcome to the File Upload API!');
// });

// // Start the server on port 5001
// const PORT = 5001;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

