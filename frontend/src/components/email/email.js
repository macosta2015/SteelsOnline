import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Snackbar, Typography, Container } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

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
    setEmail(''); // Clear the input
    setOpenSnackbar(true); // Show success message
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
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
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
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
    </Container>
  );
}

export default EmailList;


