import { create } from 'zustand';

interface UIState {
  isUploadModalOpen: boolean;
  toggleUploadModal: (isOpen?: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isUploadModalOpen: false,
  toggleUploadModal: (isOpen) => set((state) => ({ 
    isUploadModalOpen: isOpen !== undefined ? isOpen : !state.isUploadModalOpen 
  })),
}));
