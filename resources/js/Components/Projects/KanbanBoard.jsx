import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import { router } from '@inertiajs/react';

export default function KanbanBoard({ tasks }) {
  const [columns, setColumns] = useState({});

  useEffect(() => {
    setColumns({
      'no_status': {
        id: 'no_status',
        title: 'No status',
        taskIds: tasks.filter(t => t.status === 'no_status').map(t => t.id)
      },
      'todo': {
        id: 'todo',
        title: 'To do',
        taskIds: tasks.filter(t => t.status === 'todo').map(t => t.id)
      },
      'in_progress': {
        id: 'in_progress',
        title: 'In progress',
        taskIds: tasks.filter(t => t.status === 'in_progress').map(t => t.id)
      },
      'review': {
        id: 'review',
        title: 'Review',
        taskIds: tasks.filter(t => t.status === 'review').map(t => t.id)
      },
      'completed': {
        id: 'completed',
        title: 'Completed',
        taskIds: tasks.filter(t => t.status === 'completed').map(t => t.id)
      }
    });
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || !columns[over.id]) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const newStatus = over.id;

    if (activeTask && activeTask.status !== newStatus) {
      setColumns(prev => {
        const oldStatus = activeTask.status || 'no_status';
        return {
          ...prev,
          [oldStatus]: {
            ...prev[oldStatus],
            taskIds: prev[oldStatus].taskIds.filter(id => id !== activeTask.id)
          },
          [newStatus]: {
            ...prev[newStatus],
            taskIds: [...prev[newStatus].taskIds, activeTask.id]
          }
        };
      });

      router.patch(route('tasks.update', activeTask.id), {
        status: newStatus
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full min-h-[calc(100vh-12rem)] bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 auto-rows-max">
          {Object.values(columns).map((column, index) => (
            <KanbanColumn 
              key={column.id} 
              column={column} 
              tasks={tasks.filter(t => column.taskIds.includes(t.id))}
              colorIndex={index}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
} 