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

    const url = URL.createObjectURL(file);
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
    <iframe
      src={previewUrl}
      className="w-full h-[600px] rounded-lg border border-zinc-800"
      title="PDF Preview"
    />
  );
};
