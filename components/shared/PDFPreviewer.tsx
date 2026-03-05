"use client";

import React, { useState, useEffect } from 'react';

interface PDFPreviewerProps {
  fileBuffer: ArrayBuffer | null;
}

export const PDFPreviewer: React.FC<PDFPreviewerProps> = ({ fileBuffer }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!fileBuffer) {
      setPreviewUrl(null);
      return;
    }

    const blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [fileBuffer]);

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
