// components/KanbanBoard.jsx - Spotify-inspired drag-and-drop kanban board
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
  Wishlist: 'bg-gray-900/50 border-gray-700',
  Applied: 'bg-blue-900/30 border-blue-700',
  Interview: 'bg-yellow-900/30 border-yellow-700',
  Offer: 'bg-green-900/30 border-green-700',
  Rejected: 'bg-red-900/30 border-red-700',
};

const statusColors = {
  Wishlist: 'bg-gray-600',
  Applied: 'bg-blue-600',
  Interview: 'bg-yellow-600',
  Offer: 'bg-green-600',
  Rejected: 'bg-red-600',
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
      className={`bg-[#181818] rounded-lg p-3 mb-2 shadow-sm border-l-4 cursor-grab active:cursor-grabbing hover:bg-[#282828] transition-all ${borderColor}`}
    >
      <h4 className="font-medium text-white text-sm">{job.title}</h4>
      <p className="text-xs text-[#B3B3B3] mt-1">{job.company}</p>
      {job.dateApplied && (
        <p className="text-xs text-[#B3B3B3] mt-2">
          📅 {new Date(job.dateApplied).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

// Droppable column component (THIS WAS MISSING - FIXES DRAG & DROP)
function DroppableColumn({ column, jobs, columnId }) {
  const { setNodeRef } = useSortable({ id: columnId });
  const jobIds = jobs.map(job => job._id);

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-3 ${columnColors[column]} border transition-all`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{column}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[column]} text-white`}>
          {jobs.length}
        </span>
      </div>

      <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
        <div className="min-h-[400px] space-y-2">
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
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const getJobsByColumn = () => {
    const grouped = {};
    columns.forEach(col => {
      grouped[col] = jobs.filter(job => job.status === col);
    });
    return grouped;
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeJob = jobs.find(job => job._id === active.id);
    if (!activeJob) return;

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

    if (newStatus && activeJob.status !== newStatus) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`${API_URL}/jobs/${activeJob._id}/status`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job._id === activeJob._id ? { ...job, status: newStatus } : job
          )
        );
      } catch (err) {
        console.error('Failed to update status:', err);
        loadJobs();
      }
    }
  };

  const groupedJobs = getJobsByColumn();
  const columnIds = columns;

  if (loading) {
    return (
      <div className="bg-[#181818] rounded-xl p-8 shadow-xl">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954]"></div>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={({ active }) => setActiveId(active.id)}
    >
      {/* IMPORTANT: SortableContext for columns enables dropping between columns */}
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
        {activeId ? (() => {
          const job = jobs.find(j => j._id === activeId);
          if (!job) return null;
          const borderColor = statusColors[job.status]?.replace('bg-', 'border-l-') || 'border-l-gray-500';
          return (
            <div className={`bg-[#282828] rounded-xl p-3 shadow-xl border-l-4 ${borderColor} rotate-2 cursor-grabbing`}>
              <h4 className="font-medium text-white text-sm">{job.title}</h4>
              <p className="text-xs text-[#B3B3B3] mt-1">{job.company}</p>
            </div>
          );
        })() : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;