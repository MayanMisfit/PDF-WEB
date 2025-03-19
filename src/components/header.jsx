import React from 'react';

function Header() {
  return (
    <header className="bg-dracula-current py-4 shadow-lg">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-dracula-pink">PDF Converter</h1>
        <p className="text-dracula-purple">Convert PDF files to Text, Markdown, or DOC format</p>
      </div>
    </header>
  );
}

export default Header;