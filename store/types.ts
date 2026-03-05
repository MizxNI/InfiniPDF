export type FileStatus = 'idle' | 'processing' | 'completed' | 'error';

export type ToolType = 
  | 'merge' 
  | 'split' 
  | 'compress' 
  | 'pdf-to-image' 
  | 'image-to-pdf' 
  | 'organize' 
  | 'lock' 
  | 'unlock';

export interface LocalFile {
  id: string;
  file: File;
  name: string;
  size: number;
  status: FileStatus;
  previewUrl?: string;
}
