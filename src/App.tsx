import React, { useState } from 'react';
import './App.css';
import * as pdfjsLib from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

// Set up the pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function App() {
  const [convertedText, setConvertedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: TextItem) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText.trim();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const text = await extractTextFromPdf(file);
      setConvertedText(text);
    } catch (error) {
      console.error('Error converting PDF:', error);
      setConvertedText('Error converting PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([convertedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `converted_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadMd = () => {
    const mdContent = `\`\`\`\n${convertedText}\n\`\`\``;
    const element = document.createElement('a');
    const file = new Blob([mdContent], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `converted_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setConvertedText('');
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="App">
      <header>
        <h1>PDF Converter Web App</h1>
        <p className="author">Created by {process.env.REACT_APP_AUTHOR || 'MayanMisfit'}</p>
      </header>
      <main>
        <section className="converter">
          <input 
            type="file" 
            accept="application/pdf"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
          <p className="help-text">Select a PDF file to convert to text</p>
        </section>
        <section className="output">
          <h2>Converted Text</h2>
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Converting PDF...</p>
            </div>
          ) : (
            <>
              <pre>{convertedText}</pre>
              {convertedText && (
                <div className="button-group">
                  <button onClick={handleDownloadTxt}>Save as TXT</button>
                  <button onClick={handleDownloadMd}>Save as Markdown</button>
                  <button onClick={handleReset}>Reset</button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <footer>
        <p>Last updated: {process.env.REACT_APP_BUILD_DATE || '2025-03-19'}</p>
      </footer>
    </div>
  );
}

export default App;
