export type FileStatus = 'idle' | 'processing' | 'completed' | 'error';

export type ToolType = 
  | 'merge' 
  | 'split' 
  | 'delete' 
  | 'image-to-pdf' 
  | 'reorder' 
  | 'protect' 
  | 'unlock';

export interface LocalFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: FileStatus;
  previewUrl?: string;
}
