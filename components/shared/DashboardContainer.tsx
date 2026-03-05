'use client';

import React from 'react';
import { useToolStore } from '@/store/useToolStore';
import { ToolCard } from './ToolCard';
import { 
  Combine, 
  Scissors, 
  ArrowUpDown, 
  FileMinus, 
  Lock, 
  FileImage 
} from 'lucide-react';
import { ToolType } from '@/store/types';

interface ToolDefinition {
  title: string;
  description: string;
  icon: React.ElementType;
  type: ToolType;
}

const tools: ToolDefinition[] = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into a single document.',
    icon: Combine,
    type: 'merge',
  },
  {
    title: 'Split PDF',
    description: 'Extract pages from your PDF or split it into multiple files.',
    icon: Scissors,
    type: 'split',
  },
  {
    title: 'Reorder Pages',
    description: 'Change the order of pages within your PDF document.',
    icon: ArrowUpDown,
    type: 'reorder',
  },
  {
    title: 'Delete Pages',
    description: 'Remove unwanted pages from your PDF document.',
    icon: FileMinus,
    type: 'delete',
  },
  {
    title: 'Password Protect',
    description: 'Add a password to encrypt and secure your PDF.',
    icon: Lock,
    type: 'protect',
  },
  {
    title: 'Image to PDF',
    description: 'Convert JPG, PNG, or other images into a PDF file.',
    icon: FileImage,
    type: 'image-to-pdf',
  },
];

export const DashboardContainer: React.FC = () => {
  const setActiveTool = useToolStore((state) => state.setActiveTool);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
          PDF Toolkit
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          Powerful, local-first PDF tools. Your files never leave your browser.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => (
          <ToolCard
            key={index}
            title={tool.title}
            description={tool.description}
            icon={tool.icon as any}
            onClick={() => setActiveTool(tool.type)}
          />
        ))}
      </div>
    </div>
  );
};
