import React from 'react';
import { Box, List, ListItem, ListItemText, Button, Typography } from '@mui/material';

function DeleteEmail({ emailList, setEmailList }) {
  const handleDelete = (emailToDelete) => {
    setEmailList((prev) => prev.filter(email => email !== emailToDelete));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Email List:</Typography>
      <List>
        {emailList.map((email, index) => (
          <ListItem key={index} secondaryAction={
            <Button onClick={() => handleDelete(email)} color="secondary">
              Delete
            </Button>
          }>
            <ListItemText primary={email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default DeleteEmail;
