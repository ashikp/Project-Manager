import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import KanbanCard from "./KanbanCard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const columnColors = [
  'bg-purple-50 border-purple-200',
  'bg-blue-50 border-blue-200',
  'bg-yellow-50 border-yellow-200',
  'bg-pink-50 border-pink-200',
  'bg-green-50 border-green-200'
];

const headerColors = [
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-yellow-100 text-yellow-700',
  'bg-pink-100 text-pink-700',
  'bg-green-100 text-green-700'
];

export default function KanbanColumn({ column, tasks, colorIndex }) {
  const { setNodeRef } = useDroppable({
    id: column.id
  });

  const colorClass = columnColors[colorIndex % columnColors.length];
  const headerColorClass = headerColors[colorIndex % headerColors.length];

  return (
    <div className={`flex-1 min-w-[250px] max-w-[250px] rounded-lg border ${colorClass}`}>
      <div className={`flex items-center justify-between p-2 rounded-t-lg ${headerColorClass}`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{column.title}</h3>
          <span className="px-2 py-0.5 text-xs rounded-full bg-white/50">
            {tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="hover:bg-white/20 h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div ref={setNodeRef} className="p-2 space-y-2 min-h-[calc(100vh-16rem)]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
} 