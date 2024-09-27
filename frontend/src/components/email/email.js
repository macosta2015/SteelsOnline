import React, { useState } from 'react';
import { Box, TextField, Button, Snackbar, Typography, Grid, Container, Alert } from '@mui/material';

function EmailList({ onEmailAdded }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);

    try {
      const response = await fetch('http://localhost:5001/saveEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setOpenSnackbar(true);
        setEmail(''); // Clear the input
        onEmailAdded(); // Notify parent to refresh the email list
      } else {
        throw new Error('Error saving email');
      }
    } catch (error) {
      console.error(error);
      setError('Error saving email');
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Add Email to List
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error}
                helperText={error}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Email
              </Button>
            </form>

            {/* Snackbar for success */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseSnackbar} severity="success">
                Email added successfully!
              </Alert>
            </Snackbar>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default EmailList;


// import React, { useState } from 'react';
// import { Box, TextField, Button, Snackbar, Typography, Grid } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// function EmailList({ onEmailAdded }) {
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState(null);
//   const [openSnackbar, setOpenSnackbar] = useState(false);

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(String(email).toLowerCase());
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     setError(null);

//     try {
//       const response = await fetch('http://localhost:5001/saveEmail', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });

//       if (response.ok) {
//         setOpenSnackbar(true);
//         setEmail(''); // Clear the input
//         onEmailAdded(); // Notify parent to refresh the email list
//       } else {
//         throw new Error('Error saving email');
//       }
//     } catch (error) {
//       console.error(error);
//       setError('Error saving email');
//     }
//   };

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   return (
//     <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
//       <Grid item xs={12} sm={8} md={6} lg={4}>
//         <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: '#f9f9f9' }}>
//           <Typography variant="h5" align="center" gutterBottom>
//             Add Email to List
//           </Typography>

//           <form onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               label="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               error={!!error}
//               helperText={error}
//               variant="outlined"
//               sx={{ mb: 2 }}
//             />
//             <Button type="submit" variant="contained" color="primary" fullWidth>
//               Add Email
//             </Button>
//           </form>

//           {/* Snackbar for success */}
//           <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//             <Alert onClose={handleCloseSnackbar} severity="success">
//               Email added successfully!
//             </Alert>
//           </Snackbar>
//         </Box>
//       </Grid>
//     </Grid>
//   );
// }

// export default EmailList;


