import React, { useState } from 'react';
import axios from 'axios';

function PdfResumeUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(' none');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    function openFileSubmission() {
        document.getElementById('fileInput').click();
    }

    const handleSubmit = async (event) => {
        if (!selectedFile) {
            setUploadStatus('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:8080/uploadResumePdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("response: " + response.data.data)
            setUploadStatus(`File uploaded successfully: ${response.data.data}`);
        } catch (error) {
            setUploadStatus(`Error uploading file: ${error.message}`);
        }
    };

    return (
        <div className="w-[400px] h-[200px] bg-emerald-500 rounded-2xl flex flex-col justify-center items-center text-lg">
            <input type="file" accept=".pdf" onChange={handleFileChange} id="fileInput" className="hidden" />
            <p onClick={openFileSubmission} className="underline cursor-pointer"> {selectedFile ? selectedFile.name : 'Click to select a PDF file'} </p>
            {<button onClick={handleSubmit} className="underline p-4" > Upload to backend </button>}
            {<p className="font-mono text-sm text-center">status: {uploadStatus}</p>}
        </div>
    );
}

export default PdfResumeUpload;