import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, Button, CircularProgress, TextField } from '@mui/material';

function EmailAttachmentForm() {
    const [file, setFile] = useState();
    const [email, setEmail] = useState('');
    const [emails, setEmails] = useState([]);
    const [uploadedFileUrl, setUploadedFileUrl] = useState('');
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    // Handle file selection and validation
    function handleFileChange(event) {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        // Validate file size and type
        if (selectedFile.size > 5000000) {
            setError(new Error('File size should be less than 5MB.'));
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
            setError(new Error('Only JPEG or PNG files are allowed.'));
            return;
        }

        setError(null);
        setFile(selectedFile);
    }

    // Handle email input and add it to the email list
    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handleAddEmail() {
        if (email && !emails.includes(email)) {
            setEmails([...emails, email]);
            setEmail('');
        }
    }

    // Handle file upload and email sending
    function handleSubmit(event) {
        event.preventDefault();

        if (!file || emails.length === 0) {
            setError(new Error('Please select a file and enter at least one email.'));
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        axios.post('http://localhost:5001/uploadFile', formData, {
            headers: { 'content-type': 'multipart/form-data' },
        })
            .then((response) => {
                const uploadedFilePath = response.data.file; // Get the file path from backend
                setUploadedFileUrl(uploadedFilePath);
                setLoading(false);

                // Call EmailJS to send the email with the uploaded file from backend
                sendEmails(uploadedFilePath); // Call function to send emails with the uploaded file
            })
            .catch((error) => {
                setError(new Error('Error uploading file: ' + error.message));
                setLoading(false);
            });
    }

    // Function to send emails with the uploaded file
    function sendEmails(uploadedFilePath) {
        emails.forEach((recipientEmail) => {
            const emailData = {
                service_id: 'your_service_id',
                template_id: 'your_template_id',
                user_id: 'your_user_id',
                template_params: {
                    'recipient_email': recipientEmail,
                    'attachment_url': `http://localhost:5001${uploadedFilePath}` // Use the backend file URL
                },
            };

            // Sending email via EmailJS API
            axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData)
                .then(() => {
                    console.log(`Email sent to ${recipientEmail}`);
                })
                .catch((error) => {
                    console.error('Error sending email:', error.message);
                    setError(new Error('Error sending email: ' + error.message));
                });
        });
    }

    return (
        <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
            <Grid item xs={12} sm={8} md={6} lg={4}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                        Send Attachment via Email
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={handleEmailChange}
                            variant="outlined"
                            margin="normal"
                        />
                        <Button variant="contained" color="primary" onClick={handleAddEmail} fullWidth sx={{ mb: 2 }}>
                            Add Email
                        </Button>

                        <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                            Emails: {emails.join(', ')}
                        </Typography>

                        <Button variant="outlined" component="label" fullWidth sx={{ mb: 3 }}>
                            Select File
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>

                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Upload & Send Email
                        </Button>

                        {loading && <CircularProgress sx={{ mt: 2 }} />}
                        {uploadedFileUrl && <Typography sx={{ mt: 2 }}>File uploaded successfully!</Typography>}
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error.message}</Typography>}
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default EmailAttachmentForm;


// import React, { useState } from 'react';
// import axios from 'axios';
// import { Grid, Paper, Typography, Button, CircularProgress, TextField } from '@mui/material';

// function EmailAttachmentForm() {
//     const [file, setFile] = useState();
//     const [email, setEmail] = useState('');
//     const [emails, setEmails] = useState([]);
//     const [uploadedFile, setUploadedFile] = useState();
//     const [error, setError] = useState();
//     const [loading, setLoading] = useState(false);

//     // Handle file selection and validation
//     function handleFileChange(event) {
//         const selectedFile = event.target.files[0];
//         if (!selectedFile) return;

//         // Validate file size and type
//         if (selectedFile.size > 5000000) {
//             setError(new Error('File size should be less than 5MB.'));
//             return;
//         }

//         if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
//             setError(new Error('Only JPEG or PNG files are allowed.'));
//             return;
//         }

//         setError(null);
//         setFile(selectedFile);
//     }

//     // Handle email input and add it to the email list
//     function handleEmailChange(event) {
//         setEmail(event.target.value);
//     }

//     function handleAddEmail() {
//         if (email && !emails.includes(email)) {
//             setEmails([...emails, email]);
//             setEmail('');
//         }
//     }

//     // Handle file upload and email sending
//     function handleSubmit(event) {
//         event.preventDefault();

//         if (!file || emails.length === 0) {
//             setError(new Error('Please select a file and enter at least one email.'));
//             return;
//         }

//         setLoading(true);

//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('fileName', file.name);

//         axios.post('http://localhost:5001/uploadFile', formData, {
//             headers: { 'content-type': 'multipart/form-data' },
//         })
//             .then((response) => {
//                 setUploadedFile(response.data.file);
//                 setLoading(false);
//                 // Here you would call EmailJS to send the email with the uploaded file
//             })
//             .catch((error) => {
//                 setError(new Error('Error uploading file: ' + error.message));
//                 setLoading(false);
//             });
//     }

//     return (
//         <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
//             <Grid item xs={12} sm={8} md={6} lg={4}>
//                 <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
//                     <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
//                         Send Attachment via Email
//                     </Typography>

//                     <form onSubmit={handleSubmit}>
//                         <TextField
//                             fullWidth
//                             label="Email"
//                             value={email}
//                             onChange={handleEmailChange}
//                             variant="outlined"
//                             margin="normal"
//                         />
//                         <Button variant="contained" color="primary" onClick={handleAddEmail} fullWidth sx={{ mb: 2 }}>
//                             Add Email
//                         </Button>

//                         <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
//                             Emails: {emails.join(', ')}
//                         </Typography>

//                         <Button variant="outlined" component="label" fullWidth sx={{ mb: 3 }}>
//                             Select File
//                             <input type="file" hidden onChange={handleFileChange} />
//                         </Button>

//                         <Button type="submit" variant="contained" color="primary" fullWidth>
//                             Upload & Send Email
//                         </Button>

//                         {loading && <CircularProgress sx={{ mt: 2 }} />}
//                         {uploadedFile && <Typography sx={{ mt: 2 }}>File uploaded successfully!</Typography>}
//                         {error && <Typography color="error" sx={{ mt: 2 }}>{error.message}</Typography>}
//                     </form>
//                 </Paper>
//             </Grid>
//         </Grid>
//     );
// }

// export default EmailAttachmentForm;
