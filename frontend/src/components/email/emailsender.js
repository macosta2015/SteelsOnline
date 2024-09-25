import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Paper, Typography, Button, CircularProgress, TextField } from '@mui/material';

function EmailAttachmentForm() {
    const [file, setFile] = useState();
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

    // Handle file upload and email sending
    function handleSubmit(event) {
        event.preventDefault();

        if (!file) {
            setError(new Error('Please select a file.'));
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name);

        // Upload file to the backend
        axios.post('http://localhost:5001/uploadFile', formData, {
            headers: { 'content-type': 'multipart/form-data' },
        })
            .then((response) => {
                const uploadedFilePath = response.data.file; // Get the file path from backend
                setUploadedFileUrl(uploadedFilePath);
                setLoading(false);

                console.log('File uploaded and backend will handle sending emails');
            })
            .catch((error) => {
                setError(new Error('Error uploading file: ' + error.message));
                setLoading(false);
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
                        <Button variant="outlined" component="label" fullWidth sx={{ mb: 3 }}>
                            Select File
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>

                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Upload & Send Email
                        </Button>

                        {loading && <CircularProgress sx={{ mt: 2 }} />}
                        {uploadedFileUrl && <Typography sx={{ mt: 2 }}>File uploaded successfully! Emails will be sent by backend.</Typography>}
                        {error && <Typography color="error" sx={{ mt: 2 }}>{error.message}</Typography>}
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default EmailAttachmentForm;

