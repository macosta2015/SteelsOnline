import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function DisplayEmails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('http://localhost:5001/emails.txt');
        if (!response.ok) {
          throw new Error('Failed to fetch emails');
        }
        const data = await response.text();
        const emailList = data.split('\n').filter(email => email); // Split by new line and filter out empty strings
        setEmails(emailList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  // Handle email deletion
  const handleDelete = (emailToDelete) => {
    const updatedEmails = emails.filter(email => email !== emailToDelete);
    setEmails(updatedEmails);

    // Optionally, you can send the updated email list to the server
    // to persist the changes (discussed later).
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 5, px: 2, py: 3 }}>
      <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3, maxWidth: '600px', margin: '0 auto' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Emails from File
        </Typography>
        <List>
          {emails.map((email, index) => (
            <ListItem
              key={index}
              sx={{ borderBottom: '1px solid #ddd' }}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(email)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={email} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}

export default DisplayEmails;
