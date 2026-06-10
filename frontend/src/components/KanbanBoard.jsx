// components/KanbanBoard.jsx - Drag-and-drop kanban board using @dnd-kit
import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';

import { API_URL } from '../config';

const columns = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'];

const columnColors = {
  Wishlist: 'bg-gray-100 border-gray-300',
  Applied: 'bg-blue-50 border-blue-200',
  Interview: 'bg-yellow-50 border-yellow-200',
  Offer: 'bg-green-50 border-green-200',
  Rejected: 'bg-red-50 border-red-200',
};

const statusColors = {
  Wishlist: 'bg-gray-500',
  Applied: 'bg-blue-500',
  Interview: 'bg-yellow-500',
  Offer: 'bg-green-500',
  Rejected: 'bg-red-500',
};

// Draggable job card component
function DraggableJobCard({ job }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const borderColor = statusColors[job.status]?.replace('bg-', 'border-l-') || 'border-l-gray-500';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-3 mb-2 shadow-sm border-l-4 ${borderColor} cursor-grab active:cursor-grabbing hover:shadow-md transition`}
    >
      <h4 className="font-medium text-gray-800 text-sm">{job.title}</h4>
      <p className="text-xs text-gray-500 mt-1">{job.company}</p>
      {job.dateApplied && (
        <p className="text-xs text-gray-400 mt-2">
          Applied: {new Date(job.dateApplied).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

// Droppable column component
function DroppableColumn({ column, jobs, columnId }) {
  const { setNodeRef } = useSortable({ id: columnId });
  const jobIds = jobs.map(job => job._id);

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-3 ${columnColors[column]} border`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">{column}</h3>
        <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColors[column]}`}>
          {jobs.length}
        </span>
      </div>

      <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
        <div className="min-h-[400px]">
          {jobs.map((job) => (
            <DraggableJobCard key={job._id} job={job} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function KanbanBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

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

  // Load jobs from backend
  const loadJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Get jobs grouped by status
  const getJobsByColumn = () => {
    const grouped = {};
    columns.forEach(col => {
      grouped[col] = jobs.filter(job => job.status === col);
    });
    return grouped;
  };

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeJob = jobs.find(job => job._id === active.id);
    if (!activeJob) return;

    // Determine target status from where it was dropped
    let newStatus = null;
    
    // Check if dropped on a column ID (which is the status name)
    if (columns.includes(over.id)) {
      newStatus = over.id;
    } else {
      // Dropped on another job - get that job's column
      const overJob = jobs.find(job => job._id === over.id);
      if (overJob && overJob.status) {
        newStatus = overJob.status;
      }
    }

    // If status changed, update in database
    if (newStatus && activeJob.status !== newStatus) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`${API_URL}/jobs/${activeJob._id}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // Update local state immediately for smooth UI
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job._id === activeJob._id ? { ...job, status: newStatus } : job
          )
        );
      } catch (err) {
        console.error('Failed to update status:', err);
        // Revert by reloading
        loadJobs();
      }
    }
  };

  const groupedJobs = getJobsByColumn();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-center text-gray-500">Loading kanban board...</p>
      </div>
    );
  }

  // Create column IDs list for SortableContext
  const columnIds = columns;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => setActiveId(active.id)}
    >
      <SortableContext items={columnIds} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {columns.map((column) => (
            <DroppableColumn
              key={column}
              column={column}
              columnId={column}
              jobs={groupedJobs[column]}
            />
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeId ? (
          (() => {
            const job = jobs.find(j => j._id === activeId);
            if (!job) return null;
            const borderColor = statusColors[job.status]?.replace('bg-', 'border-l-') || 'border-l-gray-500';
            return (
              <div className={`bg-white rounded-lg p-3 shadow-lg border-l-4 ${borderColor} rotate-2 cursor-grabbing`}>
                <h4 className="font-medium text-gray-800 text-sm">{job.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{job.company}</p>
              </div>
            );
          })()
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;