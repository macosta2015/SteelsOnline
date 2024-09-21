import React, { useState } from 'react';
import axios from 'axios';  // Import axios for making requests
import { Box, TextField, Button, List, ListItem, ListItemText, Snackbar, Typography, Grid } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

// Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function EmailList() {
  const [email, setEmail] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle email submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setEmailList((prev) => [...prev, email]); // Add the email to the list

    // Send email to the backend
    axios.post('http://localhost:5001/saveEmail', { email })
      .then((response) => {
        console.log('Email saved:', response.data);
      })
      .catch((error) => {
        console.error('Error saving email:', error);
      });

    setEmail(''); // Clear the input
    setOpenSnackbar(true); // Show success message
  };

  // Close Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
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

          {emailList.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6">Email List:</Typography>
              <List>
                {emailList.map((email, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={email} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {/* Snackbar for success */}
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity="success">
              Email added successfully!
            </Alert>
          </Snackbar>
        </Box>
      </Grid>
    </Grid>
  );
}

export default EmailList;


// import React, { useState } from 'react';
// import { Box, TextField, Button, List, ListItem, ListItemText, Snackbar, Typography, Grid } from '@mui/material';
// import MuiAlert from '@mui/material/Alert';

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// function EmailList() {
//   const [email, setEmail] = useState('');
//   const [emailList, setEmailList] = useState([]);
//   const [error, setError] = useState(null);
//   const [openSnackbar, setOpenSnackbar] = useState(false);

//   // Email validation function
//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(String(email).toLowerCase());
//   };

//   // Handle email submission
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!validateEmail(email)) {
//       setError('Please enter a valid email address.');
//       return;
//     }

//     setError(null);
//     setEmailList((prev) => [...prev, email]); // Add the email to the list
//     setEmail(''); // Clear the input
//     setOpenSnackbar(true); // Show success message
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
//         <Box sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
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
//             <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
//               Add Email
//             </Button>
//           </form>

//           {emailList.length > 0 && (
//             <Box mt={3}>
//               <Typography variant="h6">Email List:</Typography>
//               <List>
//                 {emailList.map((email, index) => (
//                   <ListItem key={index}>
//                     <ListItemText primary={email} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Box>
//           )}

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
