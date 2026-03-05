'use client';

import React from 'react';
import { useFileStore } from '@/store/useFileStore';
import { useUIStore } from '@/store/useUIStore';
import { useToolStore } from '@/store/useToolStore';
import { WorkspaceHeader } from './WorkspaceHeader';
import { FileQueue } from './FileQueue';
import { ReorderableGrid } from './ReorderableGrid';
import { PDFPreviewer } from './PDFPreviewer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const ToolWorkspaceView: React.FC = () => {
  const files = useFileStore((state) => state.files);
  const reorderFiles = useFileStore((state) => state.reorderFiles);
  const toggleUploadModal = useUIStore((state) => state.toggleUploadModal);
  const activeTool = useToolStore((state) => state.activeTool);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WorkspaceHeader />
      
      <div className="mt-8">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/50 min-h-[400px]">
            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-100 mb-2">No files selected</h3>
            <p className="text-zinc-400 mb-6 text-center max-w-md">
              Start by adding some files to the workspace to process them with the current tool.
            </p>
            <Button 
              onClick={() => toggleUploadModal(true)}
              className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300 font-medium px-6"
            >
              Add Files
            </Button>
          </div>
        ) : activeTool === 'merge' ? (
          <ReorderableGrid items={files} onReorder={reorderFiles} />
        ) : activeTool === 'split' || activeTool === 'delete' ? (
          <PDFPreviewer file={files[0].file} />
        ) : (
          <FileQueue />
        )}
      </div>
    </div>
  );
};
