// Import necessary modules
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises; // Using fs.promises for async/await compatibility
const axios = require('axios');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the frontend

// Define the directory paths
const uploadsDirectory = path.join(__dirname, 'uploads');
const emailsFilePath = path.join(__dirname, 'emails.txt');

// Multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory);
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
app.use('/uploads', express.static(uploadsDirectory));

// Create `uploads` directory if it doesn't exist
const ensureUploadsDirectoryExists = async () => {
  try {
    await fs.mkdir(uploadsDirectory, { recursive: true });
    console.log(`Directory '${uploadsDirectory}' is ready`);
  } catch (err) {
    console.error(`Error creating directory '${uploadsDirectory}':`, err.message);
  }
};

// Endpoint to save a new email to `emails.txt`
app.post('/saveEmail', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'No email provided' });
  }

  try {
    // Read the existing emails from `emails.txt`
    const data = await fs.readFile(emailsFilePath, 'utf8').catch(() => '');
    const emails = data.split('\n').filter(Boolean);

    if (emails.includes(email)) {
      return res.status(400).send({ message: 'Email already exists' });
    }

    // Append the new email to `emails.txt`
    await fs.appendFile(emailsFilePath, `${email}\n`);
    res.status(200).send({ message: 'Email saved successfully' });
  } catch (err) {
    res.status(500).send({ message: 'Error saving email', error: err.message });
  }
});

// Endpoint to delete an email from `emails.txt`
app.delete('/deleteEmail', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('No email provided');
  }

  try {
    const data = await fs.readFile(emailsFilePath, 'utf8');
    const emails = data.split('\n').filter(Boolean);
    const updatedEmails = emails.filter((e) => e.trim().toLowerCase() !== email.trim().toLowerCase());

    if (emails.length === updatedEmails.length) {
      return res.status(404).send('Email not found');
    }

    await fs.writeFile(emailsFilePath, updatedEmails.join('\n'));
    res.status(200).send('Email deleted successfully');
  } catch (err) {
    res.status(500).send({ message: 'Error updating email file', error: err.message });
  }
});

// Endpoint to fetch all emails from `emails.txt`
app.get('/emails.txt', async (req, res) => {
  try {
    // Read the emails from `emails.txt`
    const data = await fs.readFile(emailsFilePath, 'utf8');
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ message: 'Error reading email list', error: err.message });
  }
});

// File upload endpoint
app.post('/uploadFile', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }

  // Construct the path for accessing the uploaded file
  const uploadedFilePath = `/uploads/${req.file.filename}`;
  console.log('Uploaded file path:', uploadedFilePath); // Debug log to verify file path

  // Respond with the file path for use by the frontend
  res.status(200).send({ file: uploadedFilePath });
});

// Function to read emails from `emails.txt` and send emails with the uploaded file as an attachment
async function sendEmailsWithAttachment(uploadedFilePath) {
  try {
    const data = await fs.readFile(emailsFilePath, 'utf8');
    const emailList = data.split('\n').filter(Boolean); // Read emails and filter out empty lines

    if (emailList.length === 0) {
      console.log('No emails found in the list.');
      return;
    }

    const fileUrl = `http://localhost:5001${uploadedFilePath}`;

    // Send emails to each recipient in the email list
    for (const recipientEmail of emailList) {
      const emailData = {
        service_id: 'service_cxrroqf', // Your EmailJS service ID
        template_id: 'template_dorbgjd', // Your EmailJS template ID
        user_id: 'o5MLS1yF53Sj3iw2X', // Your EmailJS public key as user ID
        template_params: {
          to_name: recipientEmail,
          from_name: 'Steel Quotes Team',
          from_email: 'your_email@example.com', // Replace with a valid sender email
          attachment_url: fileUrl, // Backend file URL
          message: 'Please find the steel quote attachment below.',
        },
      };

      try {
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData);
        console.log(`Email sent to ${recipientEmail}`);
      } catch (error) {
        console.error(`Error sending email to ${recipientEmail}:`, error.message);
      }
    }
  } catch (err) {
    console.error('Error reading email file:', err.message);
  }
}

// Root route for basic status check
app.get('/', (req, res) => {
  res.send('Welcome to the File Upload and Email API!');
});

// Start the server on port 5001
const PORT = 5001;
app.listen(PORT, async () => {
  await ensureUploadsDirectoryExists();
  console.log(`Server is running on http://localhost:${PORT}`);
});


// // Import necessary modules
// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const path = require('path');
// const fs = require('fs').promises; // Using fs.promises for async/await compatibility
// const axios = require('axios');
// const app = express();

// // Middleware to parse JSON requests
// app.use(express.json());
// app.use(cors({ origin: 'http://localhost:3000' })); // Adjust CORS as per your frontend

// // Define the directory paths
// const uploadsDirectory = path.join(__dirname, 'uploads');
// const emailsFilePath = path.join(__dirname, 'emails.txt');

// // Multer storage configuration for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDirectory);
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
// app.use('/uploads', express.static(uploadsDirectory));

// // Create `uploads` directory if it doesn't exist
// const ensureUploadsDirectoryExists = async () => {
//   try {
//     await fs.mkdir(uploadsDirectory, { recursive: true });
//     console.log(`Directory '${uploadsDirectory}' is ready`);
//   } catch (err) {
//     console.error(`Error creating directory '${uploadsDirectory}':`, err.message);
//   }
// };

// // Endpoint to save a new email to `emails.txt`
// app.post('/saveEmail', async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).send({ message: 'No email provided' });
//   }

//   try {
//     // Read the existing emails from `emails.txt`
//     const data = await fs.readFile(emailsFilePath, 'utf8').catch(() => '');
//     const emails = data.split('\n').filter(Boolean);

//     if (emails.includes(email)) {
//       return res.status(400).send({ message: 'Email already exists' });
//     }

//     // Append the new email to `emails.txt`
//     await fs.appendFile(emailsFilePath, `${email}\n`);
//     res.status(200).send({ message: 'Email saved successfully' });
//   } catch (err) {
//     res.status(500).send({ message: 'Error saving email', error: err.message });
//   }
// });

// // Endpoint to delete an email from `emails.txt`
// app.delete('/deleteEmail', async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).send('No email provided');
//   }

//   try {
//     const data = await fs.readFile(emailsFilePath, 'utf8');
//     const emails = data.split('\n').filter(Boolean);
//     const updatedEmails = emails.filter((e) => e.trim().toLowerCase() !== email.trim().toLowerCase());

//     if (emails.length === updatedEmails.length) {
//       return res.status(404).send('Email not found');
//     }

//     await fs.writeFile(emailsFilePath, updatedEmails.join('\n'));
//     res.status(200).send('Email deleted successfully');
//   } catch (err) {
//     res.status(500).send({ message: 'Error updating email file', error: err.message });
//   }
// });

// // Endpoint to fetch all emails from `emails.txt`
// app.get('/emails.txt', async (req, res) => {
//   try {
//     // Read the emails from `emails.txt`
//     const data = await fs.readFile(emailsFilePath, 'utf8');
//     res.status(200).send(data);
//   } catch (err) {
//     res.status(500).send({ message: 'Error reading email list', error: err.message });
//   }
// });

// // File upload endpoint
// app.post('/uploadFile', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send({ message: 'No file uploaded' });
//   }

//   const uploadedFilePath = `/uploads/${req.file.filename}`;
//   console.log('Uploaded file:', uploadedFilePath);

//   // Respond to the client immediately
//   res.status(200).send({ message: 'File uploaded successfully, emails are being sent' });

//   // Send email after file upload in the background
//   await sendEmailsWithAttachment(uploadedFilePath);
// });

// // Function to read emails from `emails.txt` and send emails with the uploaded file as an attachment
// async function sendEmailsWithAttachment(uploadedFilePath) {
//   try {
//     const data = await fs.readFile(emailsFilePath, 'utf8');
//     const emailList = data.split('\n').filter(Boolean); // Read emails and filter out empty lines

//     if (emailList.length === 0) {
//       console.log('No emails found in the list.');
//       return;
//     }

//     const fileUrl = `http://localhost:5001${uploadedFilePath}`;

//     // Send emails to each recipient in the email list
//     for (const recipientEmail of emailList) {
//       const emailData = {
//         service_id: 'service_cxrroqf', // Your EmailJS service ID
//         template_id: 'template_dorbgd', // Your EmailJS template ID
//         user_id: 'o5MLS1yF53Sj3iw2X', // Your EmailJS public key as user ID
//         template_params: {
//           to_name: recipientEmail,
//           from_name: 'Steel Quotes Team',
//           from_email: 'your_email@example.com', // Replace with a valid sender email
//           attachment_url: fileUrl, // Backend file URL
//           message: 'Please find the steel quote attachment below.',
//         },
//       };

//       try {
//         const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData);
//         console.log(`Email sent to ${recipientEmail}`);
//       } catch (error) {
//         console.error(`Error sending email to ${recipientEmail}:`, error.message);
//       }
//     }
//   } catch (err) {
//     console.error('Error reading email file:', err.message);
//   }
// }

// // Root route for basic status check
// app.get('/', (req, res) => {
//   res.send('Welcome to the File Upload and Email API!');
// });

// // Start the server on port 5001
// const PORT = 5001;
// app.listen(PORT, async () => {
//   await ensureUploadsDirectoryExists();
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
