import { create } from 'zustand';
import { LocalFile, FileStatus } from './types';

interface FileState {
  files: LocalFile[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  updateFileStatus: (id: string, status: FileStatus) => void;
  clearAll: () => void;
  reorderFiles: (newFiles: LocalFile[]) => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: [],
  addFiles: (newFiles) => set((state) => {
    const localFiles: LocalFile[] = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      status: 'idle',
      previewUrl: URL.createObjectURL(file)
    }));
    return { files: [...state.files, ...localFiles] };
  }),
  removeFile: (id) => set((state) => {
    const file = state.files.find(f => f.id === id);
    if (file && file.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
    return { files: state.files.filter(f => f.id !== id) };
  }),
  updateFileStatus: (id, status) => set((state) => ({
    files: state.files.map(f => f.id === id ? { ...f, status } : f)
  })),
  clearAll: () => set((state) => {
    state.files.forEach(file => {
      if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
    });
    return { files: [] };
  }),
  reorderFiles: (newFiles) => set({ files: newFiles })
}));
