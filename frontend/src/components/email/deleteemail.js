import React from 'react';
import { Box, List, ListItem, ListItemText, Button, Typography, Grid } from '@mui/material';

function DeleteEmail({ emailList, setEmailList }) {
  const handleDelete = (emailToDelete) => {
    setEmailList((prev) => prev.filter(email => email !== emailToDelete));
  };

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Box sx={{ mt: 3, padding: 2, borderRadius: 2, boxShadow: 3 }}>
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
      </Grid>
    </Grid>
  );
}

export default DeleteEmail;
