import { useState, useRef } from 'react';
import { Upload, File, X } from 'lucide-react';
import axios from 'axios';

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('invoice', selectedFile);

    try {
      const { data } = await axios.post('/invoices/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Invoice uploaded successfully! Processing...');
      setSelectedFile(null);
      if (onUploadSuccess) onUploadSuccess(data);

    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.message || 'Failed to upload invoice');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Upload Invoice</h2>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
          id="file-upload"
        />

        {!selectedFile ? (
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-2">
              Drag and drop your PDF invoice here, or{' '}
              <span className="text-blue-600 hover:text-blue-700">browse</span>
            </p>
            <p className="text-sm text-gray-500">PDF files only, max 10MB</p>
          </label>
        ) : (
          <div className="flex items-center justify-center space-x-4">
            <File className="w-8 h-8 text-blue-600" />
            <div className="flex-1 text-left">
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="btn-primary w-full mt-4"
        >
          {uploading ? 'Processing...' : 'Upload and Process'}
        </button>
      )}
    </div>
  );
};

export default FileUpload;