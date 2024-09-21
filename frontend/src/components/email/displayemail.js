import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Grid, Paper, Button } from '@mui/material';

function DisplayEmails({ emailRefreshTrigger }) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [duplicateError, setDuplicateError] = useState(null);

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
  }, [emailRefreshTrigger]); // Re-fetch emails when emailRefreshTrigger changes

  const handleDelete = async (emailToDelete) => {
    try {
      const response = await fetch('http://localhost:5001/deleteEmail', {
        method: 'DELETE', // Changed to DELETE
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToDelete }), // Send single email
      });

      if (!response.ok) {
        throw new Error('Failed to delete email');
      }

      // Remove email from the local state
      setEmails(emails.filter(email => email !== emailToDelete));
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const handleAddEmail = async (newEmail) => {
    try {
      const response = await fetch('http://localhost:5001/saveEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === 'Email already exists') {
          setDuplicateError('This email is already in use.');
        }
        throw new Error('Failed to save email');
      }

      // Clear duplicate error and re-fetch emails
      setDuplicateError(null);
      // Optionally, you can trigger a refetch here if needed
    } catch (error) {
      console.error('Error adding email:', error);
    }
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
      <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            Emails from File
          </Typography>
          {duplicateError && (
            <Typography color="error" sx={{ textAlign: 'center' }}>
              {duplicateError}
            </Typography>
          )}
          <List>
            {emails.map((email, index) => (
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
              >
                <ListItemText primary={email} sx={{ wordBreak: 'break-all' }} />
                <Button
                  onClick={() => handleDelete(email)}
                  color="secondary"
                  variant="outlined"
                  sx={{ ml: 2 }}
                >
                  Delete
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DisplayEmails;


// import React, { useEffect, useState } from 'react';
// import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Grid, Paper, Button } from '@mui/material';

// function DisplayEmails({ emailRefreshTrigger }) {
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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
//   }, [emailRefreshTrigger]); // Re-fetch emails when emailRefreshTrigger changes

//   const handleDelete = async (emailToDelete) => {
//     try {
//       const response = await fetch('http://localhost:5001/deleteEmail', {
//         method: 'DELETE', // Changed to DELETE
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: emailToDelete }), // Send single email
//       });

//       if (!response.ok) {
//         throw new Error('Failed to delete email');
//       }

//       // Remove email from the local state
//       setEmails(emails.filter(email => email !== emailToDelete));
//     } catch (error) {
//       console.error('Error deleting email:', error);
//     }
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
//       <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
//         Error: {error}
//       </Typography>
//     );
//   }

//   return (
//     <Grid container justifyContent="center" alignItems="center" sx={{ height: '100vh', padding: 2 }}>
//       <Grid item xs={12} sm={8} md={6} lg={4}>
//         <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
//           <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
//             Emails from File
//           </Typography>
//           <List>
//             {emails.map((email, index) => (
//               <ListItem
//                 key={index}
//                 sx={{
//                   backgroundColor: '#fff',
//                   mb: 1,
//                   borderRadius: 1,
//                   boxShadow: 1,
//                   '&:hover': {
//                     backgroundColor: '#f0f0f0',
//                   },
//                 }}
//               >
//                 <ListItemText primary={email} sx={{ wordBreak: 'break-all' }} />
//                 <Button
//                   onClick={() => handleDelete(email)}
//                   color="secondary"
//                   variant="outlined"
//                   sx={{ ml: 2 }}
//                 >
//                   Delete
//                 </Button>
//               </ListItem>
//             ))}
//           </List>
//         </Paper>
//       </Grid>
//     </Grid>
//   );
// }

// export default DisplayEmails;

