'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start min-h-[44px] min-w-[44px] p-6 text-left border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-950/50 transition-all hover:border-zinc-500 hover:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-zinc-400"
    >
      <div className="mb-4 p-3 rounded-lg bg-zinc-900">
        <Icon className="w-6 h-6 text-zinc-100" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-100">
        {title}
      </h3>
      <p className="text-sm text-zinc-400">
        {description}
      </p>
    </button>
  );
};
