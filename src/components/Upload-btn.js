import React, { useRef } from 'react';

function UploadButton() {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      // File is a PDF, you can upload it or perform further processing
      console.log('PDF file selected:', file.name);
    } else {
      // File is not a PDF, show error message or handle accordingly
      console.log('Please select a PDF file.');
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }} // Hide the default file input
        id="pdf-upload"
      />
      <button onClick={handleClick}>Upload PDF</button>
    </div>
  );
}

export default UploadButton;
