import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import { router } from '@inertiajs/react';

const getPriorityVariant = (priority) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'warning';
    case 'low':
      return 'secondary';
    default:
      return 'default';
  }
};

export default function KanbanCard({ task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const handleClick = (e) => {
    router.visit(route('project.tasks.show', [task.project_id, task.id]));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white rounded-lg shadow p-4 space-y-3 relative group"
    >
      <div 
        {...listeners}
        className="absolute top-0 right-0 h-full w-8 flex items-center justify-center cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      <div onClick={handleClick} className="cursor-pointer">
        <div className="flex items-center gap-2">
          <Badge variant={getPriorityVariant(task.priority)}>
            {task.priority}
          </Badge>
          {task.type && (
            <Badge variant="outline">{task.type}</Badge>
          )}
        </div>
        
        <h4 className="font-medium">{task.title}</h4>
        
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {task.assignees?.map((assignee) => (
              <img
                key={assignee.id}
                src={assignee.avatar}
                alt={assignee.name}
                className="w-6 h-6 rounded-full border-2 border-white"
              />
            ))}
          </div>
          
          {task.progress && (
            <div className="w-24 h-1 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${task.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 