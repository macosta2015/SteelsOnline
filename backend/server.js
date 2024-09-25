const express = require('express'); 
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Adjust CORS as per your frontend

// Multer storage configuration
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

// Endpoint to save a new email
app.post('/saveEmail', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).send({ message: 'No email provided' });
  }

  const filePath = path.join(__dirname, 'emails.txt');
  
  // Check if email already exists
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send({ message: 'Error reading emails file' });
    }

    const emails = data.split('\n').filter(Boolean); // Filter empty lines
    if (emails.includes(email)) {
      return res.status(400).send({ message: 'Email already exists' });
    }

    // Append the new email to emails.txt
    fs.appendFile(filePath, `${email}\n`, (err) => {
      if (err) {
        return res.status(500).send({ message: 'Error saving email' });
      }
      res.status(200).send({ message: 'Email saved successfully' });
    });
  });
});


// Set up multer for file uploads (files will be stored in 'uploads' folder)
const upload = multer({ storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve emails.txt file
app.get('/emails.txt', (req, res) => {
  const filePath = path.join(__dirname, 'emails.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading email file');
    }
    res.send(data);
  });
});

// File upload endpoint
app.post('/uploadFile', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  const uploadedFilePath = `/uploads/${req.file.filename}`;
  console.log('Uploaded file:', uploadedFilePath);

  // Send email after file upload
  sendEmailsWithAttachment(uploadedFilePath, res);
});



// Function to read emails from emails.txt and send emails with the uploaded file as attachment
function sendEmailsWithAttachment(uploadedFilePath, res) {
  fs.readFile('emails.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading email file:', err);
      return res.status(500).send({ message: 'Error reading email file' });
    }

    const emailList = data.split('\n').filter(Boolean); // Read emails and filter out empty lines

    if (emailList.length === 0) {
      return res.status(400).send({ message: 'No emails found in the list' });
    }

    // Send emails to each recipient in the email list
    emailList.forEach(async (recipientEmail) => {
      const emailData = {
        service_id: 'service_cxrroqf',   // Your EmailJS service ID
        template_id: 'template_dorbgd', // Your EmailJS template ID
        user_id: 'o5MLS1yF53Sj3iw2X',         // Your EmailJS public key as user ID
        template_params: {
          'recipient_email': recipientEmail,
          'attachment_url': `http://localhost:5001${uploadedFilePath}`, // Backend file URL
        },
      };

      try {
        await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData);
        console.log(`Email sent to ${recipientEmail}`);
      } catch (error) {
        console.error(`Error sending email to ${recipientEmail}:`, error.message);
      }
    });

    res.send({ message: 'Emails sent successfully' });
  });
}


// Endpoint to delete an email
app.delete('/deleteEmail', (req, res) => {
  const { email } = req.body;

  const filePath = path.join(__dirname, 'emails.txt');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading emails file');
    }

    const emails = data.split('\n').filter(Boolean);
    const updatedEmails = emails.filter(e => e !== email);

    fs.writeFile(filePath, updatedEmails.join('\n'), (err) => {
      if (err) {
        return res.status(500).send('Error updating email file');
      }

      res.status(200).send('Email deleted successfully');
    });
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the File Upload and Email API!');
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
// const axios = require('axios');
// const app = express();

// // Middleware to parse JSON requests
// app.use(express.json());
// app.use(cors());

// // Multer storage configuration
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
//   if (!req.file) {
//     return res.status(400).send({ message: 'No file uploaded' });
//   }

//   const uploadedFilePath = `/uploads/${req.file.filename}`;
//   console.log('Uploaded file:', uploadedFilePath);
  
//   // Send email after file upload
//   sendEmailsWithAttachment(uploadedFilePath, res);
// });

// // Function to read emails from emails.txt and send emails with the uploaded file as attachment
// function sendEmailsWithAttachment(uploadedFilePath, res) {
//   fs.readFile('emails.txt', 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading email file:', err);
//       return res.status(500).send({ message: 'Error reading email file' });
//     }

//     const emailList = data.split('\n').filter(Boolean); // Read emails and filter out empty lines

//     if (emailList.length === 0) {
//       return res.status(400).send({ message: 'No emails found in the list' });
//     }

//     // Send emails to each recipient in the email list
//     emailList.forEach((recipientEmail) => {
//       const emailData = {
//         service_id: 'your_service_id',   // Replace with your EmailJS service ID
//         template_id: 'your_template_id', // Replace with your EmailJS template ID
//         user_id: 'your_user_id',         // Replace with your EmailJS user ID
//         template_params: {
//           'recipient_email': recipientEmail,
//           'attachment_url': `http://localhost:5001${uploadedFilePath}`, // Backend file URL
//         },
//       };

//       // Sending email via EmailJS API
//       axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData)
//         .then(() => {
//           console.log(`Email sent to ${recipientEmail}`);
//         })
//         .catch((error) => {
//           console.error(`Error sending email to ${recipientEmail}:`, error.message);
//         });
//     });

//     // Respond after emails have been sent
//     res.send({ message: 'Emails sent successfully' });
//   });
// }

// // Root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the File Upload and Email API!');
// });

// // Start the server on port 5001
// const PORT = 5001;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs');
// const app = express();

// // Middleware to parse JSON requests
// app.use(express.json());
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
//   if (!req.file) {
//     return res.status(400).send({ message: 'No file uploaded' });
//   }

//   console.log('Uploaded file:', req.file);
//   res.json({ file: `/uploads/${req.file.filename}` });
// });

// // Email saving endpoint
// app.post('/saveEmail', (req, res) => {
//   const { email } = req.body;

//   // Validate email
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).send({ message: 'Invalid email format' });
//   }

//   // Read the current emails from the file
//   fs.readFile('emails.txt', 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading email file:', err);
//       return res.status(500).send({ message: 'Error reading email file' });
//     }

//     const emailList = data.split('\n').filter(Boolean);
    
//     // Check for duplicates
//     if (emailList.includes(email)) {
//       return res.status(400).send({ message: 'Email already exists' });
//     }

//     // Save email to a file
//     fs.appendFile('emails.txt', `${email}\n`, (err) => {
//       if (err) {
//         console.error('Error saving email:', err);
//         return res.status(500).send({ message: 'Error saving email' });
//       }
//       res.send({ message: 'Email saved successfully' });
//     });
//   });
// });

// // Endpoint to serve emails.txt
// app.get('/emails.txt', (req, res) => {
//   res.sendFile(path.join(__dirname, 'emails.txt'));
// });

// // Endpoint to handle email deletion
// app.delete('/deleteEmail', (req, res) => {
//   const { email } = req.body; // Single email sent from the frontend

//   // Read the current emails from the file
//   fs.readFile('emails.txt', 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading email file:', err);
//       return res.status(500).send({ message: 'Error reading email file' });
//     }

//     // Split the email file into an array and filter out the email to delete
//     const emailList = data.split('\n').filter(Boolean);
//     const updatedEmailList = emailList.filter(item => item !== email);

//     // Write the updated email list back to the file
//     fs.writeFile('emails.txt', updatedEmailList.join('\n'), 'utf8', (err) => {
//       if (err) {
//         console.error('Error saving email file:', err);
//         return res.status(500).send({ message: 'Error saving email file' });
//       }
//       res.send({ message: 'Email deleted successfully' });
//     });
//   });
// });

// // Root route
// app.get('/', (req, res) => {
//   res.send('Welcome to the File Upload API!');
// });

// // Start the server on port 5001
// const PORT = 5001;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

