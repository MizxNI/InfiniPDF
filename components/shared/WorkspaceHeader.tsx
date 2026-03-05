'use client';

import React from 'react';
import { useToolStore } from '@/store/useToolStore';
import { ArrowLeft, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const WorkspaceHeader: React.FC = () => {
  const activeTool = useToolStore((state) => state.activeTool);
  const setActiveTool = useToolStore((state) => state.setActiveTool);

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
        className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300 font-medium"
      >
        <Play className="w-4 h-4 mr-2" />
        Process
      </Button>
    </div>
  );
};
