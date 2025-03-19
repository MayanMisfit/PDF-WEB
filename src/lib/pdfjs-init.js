import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Set worker URL to use a CDN version that matches our PDF.js version
GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export { getDocument };