import React, { useState } from 'react'; 
import { Box, List, ListItem, ListItemText, Button, Typography, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function DeleteEmail({ emailList, setEmailList, triggerEmailRefresh }) {
  const [open, setOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState('');

  const handleClickOpen = (email) => {
    setEmailToDelete(email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmailToDelete('');
  };

  const handleDelete = async () => {
    try {
      const response = await fetch('http://localhost:5001/deleteEmail', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToDelete }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete email');
      }

      // Remove email from the frontend list after successful deletion
      setEmailList((prev) => prev.filter(email => email !== emailToDelete));
      triggerEmailRefresh(); // Trigger email refresh to update the display component
      handleClose(); // Close the dialog
    } catch (error) {
      console.error('Error deleting email:', error);
      handleClose(); // Close the dialog even if there's an error
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box sx={{ mt: 3, padding: 2, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6">Email List:</Typography>
          <List>
            {emailList.map((email, index) => (
              <ListItem
                key={index}
                sx={{
                  backgroundColor: '#fff',
                  mb: 1,
                  borderRadius: 1,
                  boxShadow: 1,
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
                secondaryAction={
                  <Button
                    onClick={() => handleClickOpen(email)}
                    color="secondary"
                    variant="contained"
                    sx={{ ml: 2 }}
                  >
                    Delete
                  </Button>
                }
              >
                <ListItemText primary={email} sx={{ wordBreak: 'break-all' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this email: {emailToDelete}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default DeleteEmail;


