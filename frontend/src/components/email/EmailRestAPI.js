import React, { useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { TextField, Button, Typography, Snackbar, Alert, Grid, Paper, Box } from '@mui/material';

const EmailRestAPI = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [file, setFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      console.error('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedFileUrl(`http://localhost:5001${response.data.file}`);
      console.log('File uploaded successfully:', response.data.file);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Function to handle form submission and send email using EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!uploadedFileUrl) {
      console.error('Please upload a file first.');
      return;
    }

    // Prepare email template parameters for EmailJS
    const templateParams = {
      to_name: 'Web Wizard',
      from_name: name,
      from_email: email,
      message: message,
      attachment_url: uploadedFileUrl,
    };

    try {
      // Using emailjs to send email from the client side
      const response = await emailjs.send(
        'service_cxrroqf', // Your EmailJS service ID
        'template_dorbgjd', // Your EmailJS template ID
        templateParams,
        'o5MLS1yF53Sj3iw2X' // Your EmailJS user ID
      );

      console.log('Email sent successfully:', response.status, response.text);

      // Clear the form data
      setFormData({ name: '', email: '', message: '' });
      setUploadedFileUrl('');

      // Show success snackbar
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  // Handle Snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Send an Email
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <input type="file" onChange={handleFileChange} />
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleFileUpload}
            >
              Upload File
            </Button>
            <TextField
              label="Your Name"
              name="name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <TextField
              label="Your Email"
              name="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <TextField
              label="Your Message"
              name="message"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              margin="normal"
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Send Email
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Snackbar for success message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Email sent successfully!
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default EmailRestAPI;


// import axios from 'axios';
// import React, { useState } from 'react';
// import { TextField, Button, Typography, Snackbar, Alert, Grid, Paper, Box } from '@mui/material';

// const EmailRestAPI = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: '',
//   });

//   const [uploadedFileUrl, setUploadedFileUrl] = useState(''); // State to store the uploaded file URL
//   const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar
//   const [file, setFile] = useState(null); // State to store selected file

//   // Function to handle file selection
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Function to handle file upload
//   const handleFileUpload = async () => {
//     if (!file) {
//       console.error('Please select a file to upload.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await axios.post('http://localhost:5001/uploadFile', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setUploadedFileUrl(`http://localhost:5001${response.data.file}`);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   // Function to handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, message } = formData;

//     if (!uploadedFileUrl) {
//       console.error('Please upload a file first.');
//       return;
//     }

//     // Data information for EmailJS
//     const data = {
//       service_id: 'service_cxrroqf',
//       template_id: 'template_dorbgjd',
//       user_id: 'o5MLS1yF53Sj3iw2X',
//       template_params: {
//         from_name: name,
//         from_email: email,
//         to_name: 'Web Wizard',
//         message: message,
//         attachment_url: uploadedFileUrl,
//       },
//     };

//     try {
//       const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
//       console.log('Email sent:', response.data);

//       // Clear the form data
//       setFormData({ name: '', email: '', message: '' });

//       // Show success snackbar
//       setOpenSnackbar(true);
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   };

//   // Handle Snackbar close
//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   return (
//     <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
//       <Grid item xs={12} sm={8} md={6} lg={4}>
//         <Paper elevation={3} sx={{ padding: 4 }}>
//           <Typography variant="h4" align="center" gutterBottom>
//             Send an Email
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} noValidate>
//             <input type="file" onChange={handleFileChange} />
//             <Button
//               variant="contained"
//               color="secondary"
//               fullWidth
//               sx={{ mt: 2 }}
//               onClick={handleFileUpload}
//             >
//               Upload File
//             </Button>
//             <TextField
//               label="Your Name"
//               name="name"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={formData.name}
//               onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//               required
//             />
//             <TextField
//               label="Your Email"
//               name="email"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={formData.email}
//               onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
//               required
//             />
//             <TextField
//               label="Your Message"
//               name="message"
//               variant="outlined"
//               fullWidth
//               multiline
//               rows={6}
//               margin="normal"
//               value={formData.message}
//               onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
//               required
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ mt: 2 }}
//             >
//               Send Email
//             </Button>
//           </Box>
//         </Paper>
//       </Grid>

//       {/* Snackbar for success message */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity="success">
//           Email sent successfully!
//         </Alert>
//       </Snackbar>
//     </Grid>
//   );
// };

// export default EmailRestAPI;


// import axios from 'axios';
// import React, { useState } from 'react';
// import { TextField, Button, Typography, Snackbar, Alert, Grid, Paper, Box } from '@mui/material';

// const EmailRestAPI = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });

//   const [uploadedFileUrl, setUploadedFileUrl] = useState(''); // State to store the file URL
//   const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar

//   // Function to handle file upload
//   const handleFileUpload = async (event) => {
//     const selectedFile = event.target.files[0];
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     try {
//       const response = await axios.post('http://localhost:5001/uploadFile', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setUploadedFileUrl(`http://localhost:5001${response.data.file}`);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   // Function to handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { name, email, message } = formData;

//     if (!uploadedFileUrl) {
//       console.error('Please upload a file first.');
//       return;
//     }

//     // Data information for EmailJS
//     const data = {
//       service_id: 'service_cxrroqf',
//       template_id: 'template_dorbgjd',
//       user_id: 'o5MLS1yF53Sj3iw2X',
//       template_params: {
//         from_name: name,
//         from_email: email,
//         to_name: 'Web Wizard',
//         message: message,
//         attachment_url: uploadedFileUrl, // Use the uploaded file URL as an attachment link
//       }
//     };

//     try {
//       const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
//       console.log('Email sent:', response.data);

//       // Clear the form data
//       setFormData({ name: '', email: '', message: '' });

//       // Show success snackbar
//       setOpenSnackbar(true);
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   };

//   // Handle Snackbar close
//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   return (
//     <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
//       <Grid item xs={12} sm={8} md={6} lg={4}>
//         <Paper elevation={3} sx={{ padding: 4 }}>
//           <Typography variant="h4" align="center" gutterBottom>
//             Send an Email
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} noValidate>
//             <input
//               type="file"
//               accept="image/jpeg, image/png"
//               onChange={handleFileUpload}
//               style={{ display: 'block', marginBottom: '1rem' }}
//             />
//             <TextField
//               label="Your Name"
//               name="name"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={formData.name}
//               onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//               required
//             />
//             <TextField
//               label="Your Email"
//               name="email"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={formData.email}
//               onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//               required
//             />
//             <TextField
//               label="Your Message"
//               name="message"
//               variant="outlined"
//               fullWidth
//               multiline
//               rows={6}
//               margin="normal"
//               value={formData.message}
//               onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
//               required
//             />
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ mt: 2 }}
//             >
//               Send Email
//             </Button>
//           </Box>
//         </Paper>
//       </Grid>

//       {/* Snackbar for success message */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity="success">
//           Email sent successfully!
//         </Alert>
//       </Snackbar>
//     </Grid>
//   );
// };

// export default EmailRestAPI;


// import axios from 'axios';
// import React, { useState } from 'react';
// import { TextField, Button, Typography, Snackbar, Alert, Grid, Paper, Box, Card, CardMedia, CircularProgress } from '@mui/material';

// const EmailRestAPI = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   });
//   const [file, setFile] = useState(null);
//   const [uploadedFileUrl, setUploadedFileUrl] = useState('');
//   const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar
//   const [loading, setLoading] = useState(false); // State for Loading

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevData => ({ ...prevData, [name]: value }));
//   };

//   // Handle file selection
//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!file) {
//       console.error("Please select a file before sending an email.");
//       return;
//     }

//     setLoading(true); // Start loading when file upload starts

//     // Upload the file first
//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       const uploadResponse = await axios.post('http://localhost:5001/uploadFile', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       const uploadedFilePath = `http://localhost:5001${uploadResponse.data.file}`;
//       setUploadedFileUrl(uploadedFilePath);

//       // Proceed to send the email with the uploaded file's URL
//       const { name, email, message } = formData;

//       // Data information for email
//       const emailData = {
//         service_id: 'service_cxrroqf',
//         template_id: 'template_dorbgd',
//         user_id: 'o5MLS1yF53Sj3iw2X',
//         template_params: {
//           to_name: 'Web Wizard',
//           from_name: name,
//           from_email: email,
//           message: message,
//           attachment_url: uploadedFilePath // Attach the uploaded file
//         }
//       };

//       const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData);
//       console.log('Email sent:', response.data);

//       // Clear the form data and file input
//       setFormData({ name: '', email: '', message: '' });
//       setFile(null);
//       setOpenSnackbar(true); // Show success snackbar
//     } catch (error) {
//       console.error('Error sending email:', error);
//     } finally {
//       setLoading(false); // Stop loading once upload and email sending is complete
//     }
//   };

//   // Handle Snackbar close
//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   return (
//     <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
//       <Grid item xs={12} sm={8} md={6} lg={4}>
//         <Paper elevation={3} sx={{ padding: 4 }}>
//           <Typography variant="h4" align="center" gutterBottom>
//             Send an Email with Attachment
//           </Typography>
//           <Box component="form" onSubmit={handleSubmit} noValidate>
//             <TextField
//               label="Your Name"
//               name="name"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={formData.name}
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               label="Your Email"
//               name="email"
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={formData.email}
//               onChange={handleChange}
//               required
//             />
//             <TextField
//               label="Your Message"
//               name="message"
//               variant="outlined"
//               fullWidth
//               multiline
//               rows={6}
//               margin="normal"
//               value={formData.message}
//               onChange={handleChange}
//               required
//             />
//             <Button
//               variant="contained"
//               component="label"
//               fullWidth
//               sx={{ mt: 2 }}
//             >
//               Choose File
//               <input type="file" hidden onChange={handleFileChange} />
//             </Button>
//             {file && (
//               <Card sx={{ mt: 2 }}>
//                 <CardMedia
//                   component="img"
//                   height="140"
//                   image={URL.createObjectURL(file)}
//                   alt="Selected file preview"
//                 />
//                 <Typography variant="body2" align="center" sx={{ mt: 1 }}>
//                   {file.name}
//                 </Typography>
//               </Card>
//             )}
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               fullWidth
//               sx={{ mt: 2 }}
//               disabled={loading}
//             >
//               {loading ? <CircularProgress size={24} /> : 'Send Email'}
//             </Button>
//           </Box>
//         </Paper>
//       </Grid>

//       {/* Snackbar for success message */}
//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity="success">
//           Email sent successfully!
//         </Alert>
//       </Snackbar>
//     </Grid>
//   );
// };

// export default EmailRestAPI;

