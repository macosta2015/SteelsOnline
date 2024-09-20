import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {

  const [file, setFile] = useState();
  const [uploadedFile, setUploadedFile] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  // Handle file selection and validation
  function handleChange(event) {
    const selectedFile = event.target.files[0];

    // File size validation (e.g., max 5MB)
    if (selectedFile.size > 5000000) { // 5MB limit
      setError(new Error('File size should be less than 5MB.'));
      return;
    }

    // File type validation (e.g., only JPEG and PNG allowed)
    if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setError(new Error('Only JPEG or PNG files are allowed.'));
      return;
    }

    // If file is valid, set it in state
    setError(null);
    setFile(selectedFile);
  }

  // Handle file upload
  function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError(new Error('Please select a file to upload.'));
      return;
    }

    setLoading(true); // Start loading indicator
    const url = 'http://localhost:3000/uploadFile';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };

    // Send POST request with the file
    axios.post(url, formData, config)
      .then((response) => {
        console.log(response.data);
        setUploadedFile(response.data.file);
        setLoading(false); // Stop loading indicator
      })
      .catch((error) => {
        // Handle error and set the error message
        setLoading(false);
        if (error.response) {
          console.error("Error uploading file: ", error.response.data);
          setError(new Error('Error uploading file: ' + error.response.data.message));
        } else {
          console.error("Error uploading file: ", error.message);
          setError(new Error('Error uploading file: ' + error.message));
        }
      });
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h1>React File Upload</h1>

        {/* File input for selecting the file */}
        <input type="file" onChange={handleChange} />

        {/* Submit button */}
        <button type="submit">Upload</button>
      </form>

      {/* Loading indicator */}
      {loading && <p>Uploading...</p>}

      {/* Display uploaded file if available */}
      {uploadedFile && <img src={uploadedFile} alt="Uploaded content" />}

      {/* Display error message if an error occurs */}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
}

export default App;
