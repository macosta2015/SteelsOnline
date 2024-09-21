import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Card, CardMedia, CardContent, Typography, Snackbar, Grid } from '@mui/material';

import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [file, setFile] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Handle file selection and validation
  function handleChange(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile.size > 5000000) { // 5MB limit
      setError(new Error('File size should be less than 5MB.'));
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setError(new Error('Only JPEG or PNG files are allowed.'));
      return;
    }

    setError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFile(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  }

  // Handle file upload
  function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError(new Error('Please select a file to upload.'));
      return;
    }

    setLoading(true);
    const url = 'http://localhost:5001/uploadFile';
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    axios.post(url, formData, config)
      .then((response) => {
        setUploadedFile(`http://localhost:5001${response.data.file}`);
        setLoading(false);
        setOpenSnackbar(true);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          setError(new Error('Error uploading file: ' + error.response.data.message));
        } else {
          setError(new Error('Error uploading file: ' + error.message));
        }
      });
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" align="center" gutterBottom>
            UPLOAD STEEL QUOTES
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
              accept="image/jpeg,image/png"
              style={{ display: 'none' }}
              id="upload-file"
              type="file"
              onChange={handleChange}
            />
            <label htmlFor="upload-file">
              <Button variant="contained" component="span" sx={{ mt: 2, mb: 2, width: '100%' }}>
                Choose File
              </Button>
            </label>

            {/* Show the uploaded file preview immediately after selection */}
            {uploadedFile && (
              <Card sx={{ mt: 3, width: '100%' }}>
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

            <Button type="submit" variant="contained" color="primary" sx={{ mt: 3, width: '100%' }}>
              Upload
            </Button>
          </Box>
        </form>

        {/* Loading indicator */}
        {loading && <Typography variant="body1" align="center">Uploading...</Typography>}

        {/* Display error message if an error occurs */}
        {error && <Typography variant="body1" color="error" align="center">Error: {error.message}</Typography>}

        {/* Snackbar for success message */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success">
            File uploaded successfully!
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
}

export default App;


// import './App.css';
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Box, Button, Card, CardMedia, CardContent, Typography, Snackbar } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// function App() {
//   const [file, setFile] = useState();
//   const [uploadedFile, setUploadedFile] = useState();
//   const [error, setError] = useState();
//   const [loading, setLoading] = useState(false);
//   const [openSnackbar, setOpenSnackbar] = useState(false);

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

//     setError(null);
//     setFile(selectedFile);

//     // Set uploadedFile to display the image preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setUploadedFile(reader.result);
//     };
//     reader.readAsDataURL(selectedFile);
//   }

//   // Handle file upload
//   function handleSubmit(event) {
//     event.preventDefault();

//     if (!file) {
//       setError(new Error('Please select a file to upload.'));
//       return;
//     }

//     setLoading(true); // Start loading indicator
//     const url = 'http://localhost:5001/uploadFile';
//     const formData = new FormData();
//     formData.append('file', file);

//     const config = {
//       headers: {
//         'content-type': 'multipart/form-data',
//       },
//     };

//     // Send POST request with the file
//     axios.post(url, formData, config)
//       .then((response) => {
//         console.log(response.data);
//         setUploadedFile(`http://localhost:5001${response.data.file}`);
//         setLoading(false); // Stop loading indicator
//         setOpenSnackbar(true); // Show success message
//       })
//       .catch((error) => {
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

//   // Close the Snackbar
//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   return (
//     <div className="App">
//       <form onSubmit={handleSubmit}>
//         <h1>UPLOAD STEEL QUOTES</h1>

//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           <input
//             accept="image/jpeg,image/png"
//             style={{ display: 'none' }}
//             id="upload-file"
//             type="file"
//             onChange={handleChange}
//           />
//           <label htmlFor="upload-file">
//             <Button variant="contained" component="span" sx={{ mt: 2, mb: 2 }}>
//               Choose File
//             </Button>
//           </label>

//           {/* Show the uploaded file preview immediately after selection */}
//           {uploadedFile && (
//             <Card sx={{ mt: 3, maxWidth: 500, mx: 'auto' }}>
//               <CardMedia
//                 component="img"
//                 height="400"
//                 image={uploadedFile}
//                 alt="Uploaded content"
//                 sx={{ objectFit: 'cover' }}
//               />
//               <CardContent>
//                 <Typography variant="body1" color="text.secondary">
//                   Uploaded File Preview
//                 </Typography>
//               </CardContent>
//             </Card>
//           )}

//           <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
//             Upload
//           </Button>
//         </Box>
//       </form>

//       {/* Loading indicator */}
//       {loading && <p>Uploading...</p>}

//       {/* Display error message if an error occurs */}
//       {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

//       {/* Snackbar for success message */}
//       <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//         <Alert onClose={handleCloseSnackbar} severity="success">
//           File uploaded successfully!
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }

// export default App;

