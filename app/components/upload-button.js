'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from '../componentStyles/upload-button.module.css';
import sharedStyles from '../componentStyles/shared-layout.module.css';

// Upload file button component
export default function UploadButton ( { setUploadedData, tableSelection } ) {

  // Create the state variable and function to update it.
  const [file, setFile] = useState();

  // Create state variables and their corresponding setter functions
  // for the data upload response message.
  const [message, setMessage] = useState('');

  // This function stores the input file in the state variable.
  function handleChange(event) {
    setFile(event.target.files[0])
  }

  // This function uploads the file using a http POST request from axios.
  function handleSubmit (event) {
    // Prevents the page from reloading in response to the form submission, which is the default behavior.
    event.preventDefault()

    // Check if a file was selected.
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    // Backend url
    const url = 'http://localhost:3000/api/uploadHandler';
    // Create an object containing the file data
    const formData = new FormData();
    formData.append('file',file);
    formData.append('fileName',file.name);
    formData.append('table',tableSelection);
    // Create a config object to specify that files will be uploaded
    const config = {
      headers:{
        'content-type':'multipart/form-data',
      },
    };

    // Send a POST request to the backend with the data payload and settings.
    axios.post(url,formData,config).then((response) => {
      console.log(response.data);
      setMessage(response.data.message);      // Show success message
      setUploadedData(response.data.data);    // Data to pass to the DataTable
    })
    .catch((error) => {
      setMessage('Upload failed.');
      console.error(error);
    });
  }

  return (
  <>
    <div className={sharedStyles.toolbarItem}>
      <form className={sharedStyles.toolbarForm} onSubmit={handleSubmit}>
        <div className={sharedStyles.fileInputWrapper}>
          <input className={sharedStyles.toolbarFileInput} type="file" onChange={handleChange} />
        </div>
        <button className= {sharedStyles.toolbarButton} type="submit">Upload</button>
      </form>
      {/* Use conditional rendering to check if there is a message, and if so return it (the response from the upload route) is not null/undefined/empty, then display it. */}
      {message && <p className={styles.message}>{message + "!"}</p>}
    </div>
  </>  
  );
}