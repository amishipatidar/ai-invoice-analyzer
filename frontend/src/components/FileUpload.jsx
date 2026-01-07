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
      alert(error.response?.data?.message || error.message || 'Failed to upload invoice');
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
    <div className="w-full">
      <div
        className={`relative border-4 border-solid rounded-none p-10 text-center transition-all duration-200 ${dragActive
          ? 'border-alphonse-blue bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-400 dark:border-gray-600 hover:border-alphonse-charcoal dark:hover:border-alphonse-cream'
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
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="mb-4 p-4 bg-alphonse-yellow border-2 border-black shadow-neo rounded-none">
              <Upload className="w-8 h-8 text-alphonse-charcoal" />
            </div>
            <p className="text-xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream mb-2 uppercase tracking-wide">
              Upload Invoice
            </p>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Drag & drop PDF or <span className="text-alphonse-blue dark:text-alphonse-yellow underline decoration-2 underline-offset-2">browse</span>
            </p>
            <p className="text-xs text-gray-500 mt-4 font-mono uppercase">Max Size: 10MB</p>
          </label>
        ) : (
          <div className="flex items-center justify-center space-x-4 bg-white dark:bg-alphonse-surface p-4 border-2 border-black shadow-neo dark:shadow-neo-light">
            <File className="w-8 h-8 text-alphonse-blue" />
            <div className="flex-1 text-left">
              <p className="font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream">{selectedFile.name}</p>
              <p className="text-sm font-mono text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-alphonse-red hover:text-white border-2 border-transparent hover:border-black transition-all"
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
          className="neo-btn-primary w-full mt-6 py-4 text-lg flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Start Processing</span>
              <Upload className="w-5 h-5" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default FileUpload;