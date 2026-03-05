import { create } from 'zustand';
import { ToolType } from './types';

interface ToolState {
  activeTool: ToolType | null;
  isProcessing: boolean;
  progress: number;
  setActiveTool: (tool: ToolType | null) => void;
  setProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: null,
  isProcessing: false,
  progress: 0,
  setActiveTool: (activeTool) => set({ activeTool }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setProgress: (progress) => set({ progress }),
}));
