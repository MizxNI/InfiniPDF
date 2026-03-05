import React from 'react';
import { useFileStore } from '@/store/useFileStore';
import { Trash2, File as FileIcon, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileStatus } from '@/store/types';

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const StatusIcon = ({ status }: { status: FileStatus }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    case 'processing':
      return <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    default:
      return <div className="w-4 h-4 rounded-full border border-zinc-700" />; // Idle state
  }
};

export const FileQueue: React.FC = () => {
  const files = useFileStore((state) => state.files);
  const removeFile = useFileStore((state) => state.removeFile);
  const clearAll = useFileStore((state) => state.clearAll);

  if (files.length === 0) return null;

  return (
    <div className="flex flex-col mt-6 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-3 px-1">
        <h4 className="text-sm font-medium text-zinc-400">
          Selected Files ({files.length})
        </h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAll}
          className="text-xs text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900 h-8"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 border border-zinc-800 bg-zinc-900/30 rounded-xl transition-colors hover:bg-zinc-900/50"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-800 text-zinc-400 shrink-0">
                <FileIcon className="w-5 h-5" />
              </div>
              
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-200 truncate">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-zinc-500 font-mono">
                    {formatFileSize(file.size)}
                  </span>
                  <span className="text-zinc-700 text-xs">&bull;</span>
                  <span className="text-xs capitalize flex items-center gap-1.5 text-zinc-400">
                    <StatusIcon status={file.status} />
                    {file.status}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => removeFile(file.id)}
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/80 rounded-md transition-colors shrink-0 ml-2"
              aria-label="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
