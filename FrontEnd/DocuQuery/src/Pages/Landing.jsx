import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateFile(droppedFile);
  };


  const validateFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setFile(file);
    } else {
      alert("Please upload a valid PDF file.");
      setFile(null);
    }
  };


  const handleFileUpload = async () => {
    if (!file) {
      alert("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file); 
    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("PDF uploaded successfully!");
        navigate('/chat'); 
      } else {
        alert("Failed to upload PDF. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred during file upload.");
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-100 flex flex-col items-center justify-center text-[#01d48c]">
      <h1 className='text-5xl text-center my-5'>DocuQuery</h1>
      <h2 className="text-4xl mb-6 text-slate-900">Upload your PDF</h2>
  
      <div
        className={`w-1/2 h-1/2 border-4 border-dotted rounded-lg flex items-center justify-center  ${isDragging ? 'bg-[#d1f7eb]' : 'bg-[#f0fdf9]'} border-[#01d48c] relative`} onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop} >
        {file ? (
          <p className="text-lg text-center">Selected File: {file.name}</p>
        ) : (
          <p className="text-lg text-center text-slate-900">
            Drag & Drop your PDF here or 
            <label className="text-blue-500 underline cursor-pointer ml-1">
              <input
                type="file"
                accept="application/pdf" onChange={handleFileChange} className="opacity-0 absolute w-full h-full cursor-pointer"/> browse
            </label>
          </p>
        )}
      </div>
      
      <button 
        onClick={handleFileUpload} 
        className="mt-6 p-3 bg-[#01d48c] text-white rounded-lg shadow-lg hover:bg-[#019c70] transition"> Upload and Proceed
      </button>
    </div>
  );
}

export default Landing;
