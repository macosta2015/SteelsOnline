import React, { useState } from 'react';
import { Button, CircularProgress, TextField, Container, Box, Card, CardMedia, CardContent, Typography } from '@mui/material';

import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  function handleChange(event) {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  }

  // Handle file upload
  function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      setError(new Error('Please select a file to upload.'));
      return;
    }

    setLoading(true); // Start loading indicator
    const url = 'http://localhost:5001/uploadFile';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    axios.post(url, formData, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((response) => {
      setUploadedFile(response.data.file);
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      setError(new Error('Error uploading file: ' + error.message));
    });
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        UPLOAD STEEL QUOTES
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          
          {/* File input for selecting the file */}
          <TextField
            type="file"
            onChange={handleChange}
            inputProps={{ accept: 'image/*' }}
            helperText="Choose a file to upload (only images allowed)"
            variant="outlined"
          />

          {/* Submit button */}
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </Box>
      </form>

      {/* Loading indicator */}
      {loading && <Typography variant="body2">Uploading...</Typography>}

      {/* Display uploaded file if available */}
      {/* {uploadedFile && (
        <Box mt={3}>
          <img src={uploadedFile} alt="Uploaded content" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        </Box>
      )} */}
      {uploadedFile && (
  <Card sx={{ mt: 3, maxWidth: 500, mx: 'auto' }}>
    <CardMedia
      component="img"
      height="400"
      image={uploadedFile}
      alt="Uploaded content"
      sx={{ objectFit: 'cover' }}
    />
    <CardContent>
      <Typography variant="body1" color="text.secondary">
        Uploaded File Preview
      </Typography>
    </CardContent>
  </Card>
)}

      {/* Display error message if an error occurs */}
      {error && <Typography color="error" variant="body2">Error: {error.message}</Typography>}
    </Container>
  );
}

export default App;


