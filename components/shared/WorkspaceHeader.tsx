'use client';

import React from 'react';
import { useToolStore } from '@/store/useToolStore';
import { useFileStore } from '@/store/useFileStore';
import { usePDFWorker } from '@/hooks/usePDFWorker';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const WorkspaceHeader: React.FC = () => {
  const activeTool = useToolStore((state) => state.activeTool);
  const setActiveTool = useToolStore((state) => state.setActiveTool);
  const files = useFileStore((state) => state.files);
  const { processJob } = usePDFWorker();

  const handleProcess = async () => {
    if (!activeTool) return;

    if (files.length === 0) {
      toast.error('No files selected', { description: 'Please add files to process.' });
      return;
    }

    try {
      if (activeTool === 'merge') {
        toast.loading('Merging PDFs...', { id: 'pdf-job' });

        const buffers = await Promise.all(
          files.map(async (f) => {
            if (f.arrayBuffer) return f.arrayBuffer;
            if (f.file) return await f.file.arrayBuffer();
            throw new Error(`File ${f.name} missing data`);
          })
        );

        const result = await processJob('MERGE', { pdfBuffers: buffers });

        const blob = new Blob([result], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'merged_document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Merge complete!', { id: 'pdf-job' });
      } else if (activeTool === 'lock') {
        const password = window.prompt('Enter password to encrypt the file(s):');
        if (!password) {
          toast.error('Operation aborted', { description: 'Password is required to lock files.' });
          return;
        }

        toast.loading(`Encrypting ${files.length} file(s)...`, { id: 'pdf-job' });

        for (const file of files) {
          const buffer = file.arrayBuffer || await file.file?.arrayBuffer();
          if (!buffer) continue;

          const result = await processJob('PROTECT', { pdfBuffer: buffer, password });
          
          const blob = new Blob([result], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = `locked_${file.name}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }

        toast.success('Files encrypted successfully!', { id: 'pdf-job' });
      } else if (activeTool === 'image-to-pdf') {
        toast.loading(`Converting ${files.length} image(s)...`, { id: 'pdf-job' });

        for (const file of files) {
          const buffer = file.arrayBuffer || await file.file?.arrayBuffer();
          if (!buffer) continue;

          const result = await processJob('IMAGE_TO_PDF', { imageBuffer: buffer, mimeType: file.type });
          
          const blob = new Blob([result], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          const nameWithoutExt = file.name.split('.').slice(0, -1).join('.') || file.name;
          a.download = `${nameWithoutExt}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }

        toast.success('Images converted successfully!', { id: 'pdf-job' });
      } else {
        toast.info('Feature coming soon', { description: `The ${activeTool} tool is not fully implemented yet.` });
      }
    } catch (error: any) {
      console.error(`Error processing ${activeTool}:`, error);
      toast.error('Processing failed', { 
        id: 'pdf-job', 
        description: error.message || 'An unexpected error occurred.' 
      });
    }
  };

  if (!activeTool) return null;

  return (
    <div className="flex items-center justify-between w-full pb-6 border-b border-zinc-800">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setActiveTool(null)}
          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold text-zinc-100 capitalize">
          {activeTool.replace(/-/g, ' ')}
        </h2>
      </div>
      <Button
        onClick={handleProcess}
        className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300 font-medium disabled:opacity-50"
        disabled={files.length === 0}
      >
        <Play className="w-4 h-4 mr-2" />
        Process
      </Button>
    </div>
  );
};
