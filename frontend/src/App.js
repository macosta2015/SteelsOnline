import React, { useState } from 'react';
import { Button, Typography, CircularProgress, TextField, Container, Box } from '@mui/material';
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
      {uploadedFile && (
        <Box mt={3}>
          <img src={uploadedFile} alt="Uploaded content" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
        </Box>
      )}

      {/* Display error message if an error occurs */}
      {error && <Typography color="error" variant="body2">Error: {error.message}</Typography>}
    </Container>
  );
}

export default App;



// import './App.css';
// import React, { useState } from 'react';
// import axios from 'axios';
// import Button from '@mui/material/Button';


// function App() {
//   const [file, setFile] = useState();
//   const [uploadedFile, setUploadedFile] = useState();
//   const [error, setError] = useState();
//   const [loading, setLoading] = useState(false);

//   // Handle file selection and validation
//   function handleChange(event) {
//     const selectedFile = event.target.files[0];

//     // File size validation (e.g., max 5MB)
//     if (selectedFile.size > 5000000) { // 5MB limit
//       setError(new Error('File size should be less than 5MB.'));
//       return;
//     }

//     // File type validation (e.g., only JPEG and PNG allowed)
//     if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
//       setError(new Error('Only JPEG or PNG files are allowed.'));
//       return;
//     }

//     // If file is valid, set it in state
//     setError(null);
//     setFile(selectedFile);
//   }

//   // Handle file upload
//   function handleSubmit(event) {
//     event.preventDefault();

//     if (!file) {
//       setError(new Error('Please select a file to upload.'));
//       return;
//     }

//     setLoading(true); // Start loading indicator
//     const url = 'http://localhost:5001/uploadFile'; // Updated URL
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('fileName', file.name);

//     const config = {
//       headers: {
//         'content-type': 'multipart/form-data',
//       },
//     };

//     // Send POST request with the file
//     axios.post(url, formData, config)
//       .then((response) => {
//         console.log(response.data);
//         setUploadedFile(response.data.file);
//         setLoading(false); // Stop loading indicator
//       })
//       .catch((error) => {
//         // Handle error and set the error message
//         setLoading(false);
//         if (error.response) {
//           console.error("Error uploading file: ", error.response.data);
//           setError(new Error('Error uploading file: ' + error.response.data.message));
//         } else {
//           console.error("Error uploading file: ", error.message);
//           setError(new Error('Error uploading file: ' + error.message));
//         }
//       });
//   }

//   return (
//     <div className="App">
//       <form onSubmit={handleSubmit}>

//         <h1>UPLOAD STEEL QUOTES</h1>
//       <Button variant="contained" color="primary">
//         Click Me
//       </Button>

//         {/* File input for selecting the file */}
//         <input type="file" onChange={handleChange} />

//         {/* Submit button */}
//         <button type="submit">Upload</button>
//       </form>

//       {/* Loading indicator */}
//       {loading && <p>Uploading...</p>}

//       {/* Display uploaded file if available */}
//       {uploadedFile && <img src={uploadedFile} alt="Uploaded content" />}

//       {/* Display error message if an error occurs */}
//       {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
//     </div>
//   );
// }

// export default App;