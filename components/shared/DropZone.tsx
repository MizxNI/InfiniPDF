'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileStore } from '@/store/useFileStore';
import { CloudUpload } from 'lucide-react';
import { toast } from 'sonner';

export const DropZone: React.FC = () => {
  const addFiles = useFileStore((state) => state.addFiles);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      addFiles(acceptedFiles);
      toast.success(`Successfully added ${acceptedFiles.length} file${acceptedFiles.length === 1 ? '' : 's'}`);
    }
  }, [addFiles]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: true, // We have a separate Browse File button inside
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`relative flex flex-col items-center justify-center p-10 mt-4 border-2 border-dashed rounded-xl transition-colors duration-200 ${
        isDragActive
          ? 'border-zinc-500 bg-zinc-900/80'
          : 'border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/40'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-zinc-900 text-zinc-100">
        <CloudUpload className="w-6 h-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-100 text-center">
        Choose a file or drag & drop it here.
      </h3>
      <p className="mb-6 text-sm text-zinc-400 text-center">
        JPEG, PNG, PDF formats, up to 50 MB.
      </p>
      <button
        onClick={open}
        className="px-6 py-2 text-sm font-medium text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-md hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        Browse File
      </button>
    </div>
  );
};
