import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PDFConverter from './components/PDFConverter.jsx';
import Header from './components/Header.jsx';

function App() {
  const [convertedText, setConvertedText] = useState('');
  const [outputFormat, setOutputFormat] = useState('text');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated] = useState('2025-03-19 20:10:12'); // UTC time
  const [currentUser] = useState('MayanMisfit');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        try {
          setIsLoading(true);
          setError(null);
          const text = await PDFConverter.convertToText(file);
          setConvertedText(text);
        } catch (err) {
          setError(err.message);
          console.error('Error processing PDF:', err);
        } finally {
          setIsLoading(false);
        }
      }
    }
  });

  return (
    <div className="min-h-screen bg-dracula-background text-dracula-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* File Drop Zone */}
        <div className="mb-8">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-dracula-green bg-dracula-current/50' : 'border-dracula-purple hover:border-dracula-pink'}`}
          >
            <input {...getInputProps()} />
            <p>{isDragActive ? 'Drop the PDF here...' : 'Drag and drop a PDF file here, or click to select a file'}</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center p-4 text-dracula-purple">
            <p>Converting PDF... Please wait...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="text-center p-4 text-dracula-red mb-4">
            <p>Error: {error}</p>
          </div>
        )}

        {/* Format Selection */}
        <div className="mb-4 flex items-center space-x-4">
          <label className="text-dracula-purple">Output Format:</label>
          <select 
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="bg-dracula-current text-dracula-foreground rounded px-4 py-2 border border-dracula-purple focus:border-dracula-pink focus:outline-none"
          >
            <option value="text">Text</option>
            <option value="markdown">Markdown</option>
            <option value="doc">DOC</option>
          </select>
        </div>

        {/* Text Area */}
        <div className="border rounded-lg border-dracula-purple overflow-hidden">
          <textarea
            value={convertedText}
            onChange={(e) => setConvertedText(e.target.value)}
            className="w-full h-[400px] p-4 bg-dracula-current text-dracula-foreground font-mono resize-none focus:outline-none focus:ring-2 focus:ring-dracula-purple"
            placeholder="Converted text will appear here..."
          />
        </div>

        {/* Download Button */}
        <button 
          onClick={() => PDFConverter.download(convertedText, outputFormat)}
          className={`mt-4 bg-dracula-purple hover:bg-dracula-pink text-dracula-foreground font-bold py-2 px-4 rounded transition-colors
            ${(!convertedText || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!convertedText || isLoading}
        >
          Download {outputFormat.toUpperCase()}
        </button>

        {/* Footer Information */}
        <div className="mt-6 text-sm text-dracula-comment border-t border-dracula-current pt-4">
          <div className="flex justify-between items-center">
            <div>
              <p>Last Updated: {lastUpdated} UTC</p>
              <p>User: {currentUser}</p>
            </div>
            <div className="text-right">
              <p className="text-dracula-purple">PDF-WEB Converter</p>
              <p className="text-xs">Dracula Theme</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;