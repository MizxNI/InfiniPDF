"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileText, GripVertical } from 'lucide-react';

export interface ReorderableItem {
  id: string;
  name: string;
}

interface ReorderableGridProps {
  items: ReorderableItem[];
  onReorder: (items: ReorderableItem[]) => void;
}

const SortableItem = ({ id, name }: { id: string; name: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex items-center gap-3 transition-colors ${
        isDragging ? 'shadow-xl border-zinc-500' : 'hover:bg-zinc-900/50 hover:border-zinc-700'
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded bg-zinc-900 text-zinc-400">
        <FileText className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-zinc-200 truncate flex-1" title={name}>
        {name}
      </p>
    </div>
  );
};

export const ReorderableGrid: React.FC<ReorderableGridProps> = ({ items, onReorder }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} name={item.name} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
