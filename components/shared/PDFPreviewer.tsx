"use client";

import React, { useState, useEffect } from 'react';

interface PDFPreviewerProps {
  file: File | null;
}

export const PDFPreviewer: React.FC<PDFPreviewerProps> = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const blob = new Blob([file], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!previewUrl) {
    return (
      <div className="w-full h-[600px] rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center animate-pulse">
        <span className="text-zinc-500 font-medium">Loading preview...</span>
      </div>
    );
  }

  return (
    <object 
      data={previewUrl} 
      type="application/pdf" 
      className="w-full h-[600px] rounded-lg border border-zinc-800"
    >
      <p>Your browser does not support PDFs. <a href={previewUrl} className="text-blue-400 hover:underline">Download the PDF</a>.</p>
    </object>
  );
};
