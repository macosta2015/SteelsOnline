import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

function DisplayEmails({ emailRefreshTrigger }) {
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
        const emailList = data.split('\n').filter(email => email);
        setEmails(emailList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [emailRefreshTrigger]); // Re-fetch emails when emailRefreshTrigger changes

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Emails from File:</Typography>
      <List>
        {emails.map((email, index) => (
          <ListItem key={index}>
            <ListItemText primary={email} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default DisplayEmails;


// import React, { useEffect, useState } from 'react';
// import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Paper, IconButton, Snackbar } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import MuiAlert from '@mui/material/Alert';

// function DisplayEmails() {
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   useEffect(() => {
//     const fetchEmails = async () => {
//       try {
//         const response = await fetch('http://localhost:5001/emails.txt');
//         if (!response.ok) {
//           throw new Error('Failed to fetch emails');
//         }
//         const data = await response.text();
//         const emailList = data.split('\n').filter(email => email); // Split by new line and filter out empty strings
//         setEmails(emailList);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmails();
//   }, []);

//   // Handle email deletion
//   const handleDelete = async (emailToDelete) => {
//     const updatedEmails = emails.filter(email => email !== emailToDelete);
//     setEmails(updatedEmails);

//     try {
//       const response = await fetch('http://localhost:5001/deleteEmail', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ emails: updatedEmails }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete email on the server');
//       }

//       setSnackbarOpen(true);
//     } catch (err) {
//       console.error('Error deleting email:', err);
//     }
//   };

//   const handleSnackbarClose = () => {
//     setSnackbarOpen(false);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <Typography color="error" variant="h6">
//           Error: {error}
//         </Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ mt: 5, px: 2, py: 3 }}>
//       <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3, maxWidth: '600px', margin: '0 auto' }}>
//         <Typography variant="h5" align="center" gutterBottom>
//           Emails from File
//         </Typography>
//         <List>
//           {emails.map((email, index) => (
//             <ListItem
//               key={index}
//               sx={{ borderBottom: '1px solid #ddd' }}
//               secondaryAction={
//                 <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(email)}>
//                   <DeleteIcon />
//                 </IconButton>
//               }
//             >
//               <ListItemText primary={email} />
//             </ListItem>
//           ))}
//         </List>
//       </Paper>

//       {/* Snackbar for success */}
//       <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
//         <MuiAlert onClose={handleSnackbarClose} severity="success" variant="filled">
//           Email deleted successfully!
//         </MuiAlert>
//       </Snackbar>
//     </Box>
//   );
// }

// export default DisplayEmails;
