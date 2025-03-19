import { getDocument } from '../lib/pdfjs-init.js';

class PDFConverter {
  static async convertToText(file) {
    try {
      console.log('Starting PDF conversion...'); // Debug log
      const arrayBuffer = await file.arrayBuffer();
      console.log('File loaded as ArrayBuffer'); // Debug log
      
      const loadingTask = getDocument(new Uint8Array(arrayBuffer));
      console.log('PDF loading task created'); // Debug log
      
      const pdf = await loadingTask.promise;
      console.log(`PDF loaded. Number of pages: ${pdf.numPages}`); // Debug log

      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n\n';
        console.log(`Page ${pageNum} processed`); // Debug log
      }

      return fullText;
    } catch (error) {
      console.error('Error converting PDF:', error);
      throw new Error(`Failed to convert PDF: ${error.message}`);
    }
  }

  static download(content, format) {
    if (!content) return;
    
    let mimeType = 'text/plain';
    let extension = format;
    
    switch (format) {
      case 'markdown':
        mimeType = 'text/markdown';
        extension = 'md';
        break;
      case 'doc':
        mimeType = 'application/msword';
        extension = 'doc';
        break;
      default:
        mimeType = 'text/plain';
        extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-file.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default PDFConverter;