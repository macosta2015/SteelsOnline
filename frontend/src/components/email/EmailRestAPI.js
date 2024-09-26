import axios from 'axios';
import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';

const EmailRestAPI = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    // Data information
    const data = {
      service_id: 'service_cxrroqf',
      template_id: 'template_dorbgjd',
      user_id: 'o5MLS1yF53Sj3iw2X',
      template_params: {
        from_name: name,
        from_email: email,
        to_name: 'Web Wizard',
        message: message
      }
    };

    try {
      const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
      console.log('Email sent:', response.data);

      // Clear the form data
      setFormData({ name: '', email: '', message: '' });

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
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Send an Email
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Your Name"
          name="name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          label="Your Email"
          name="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
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
          onChange={handleChange}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '1rem' }}
        >
          Send Email
        </Button>
      </form>

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
    </Container>
  );
};

export default EmailRestAPI;

