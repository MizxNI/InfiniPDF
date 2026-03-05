import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/useUIStore';
import { DropZone } from './DropZone';

export const GlobalUploadModal: React.FC = () => {
  const isUploadModalOpen = useUIStore((state) => state.isUploadModalOpen);
  const toggleUploadModal = useUIStore((state) => state.toggleUploadModal);

  return (
    <Dialog open={isUploadModalOpen} onOpenChange={toggleUploadModal}>
      <DialogContent className="sm:max-w-2xl bg-zinc-950 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload files</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Select and upload the files of your choice
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <DropZone />
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => toggleUploadModal(false)}
            className="border-zinc-800 bg-transparent text-zinc-100 hover:bg-zinc-900 hover:text-zinc-100 transition-colors focus:ring-zinc-400"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
