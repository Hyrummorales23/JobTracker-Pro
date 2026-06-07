// pages/Dashboard.jsx - Complete Dashboard with JobForm, Kanban, and Charts
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import JobList from '../components/JobList';
import KanbanBoard from '../components/KanbanBoard';
import ChartsDashboard from '../components/ChartsDashboard';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [view, setView] = useState('joblist'); // 'joblist', 'kanban', or 'charts'
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Refresh components when a new job is added
  const handleJobAdded = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">JobTracker Pro</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setView('joblist')}
            className={`px-4 py-2 font-medium rounded-t-lg transition ${
              view === 'joblist'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Jobs List
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`px-4 py-2 font-medium rounded-t-lg transition ${
              view === 'kanban'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setView('charts')}
            className={`px-4 py-2 font-medium rounded-t-lg transition ${
              view === 'charts'
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard Charts
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {view === 'joblist' && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <JobForm onJobAdded={handleJobAdded} />
            <JobList key={refreshKey} />
          </div>
        )}
        {view === 'kanban' && <KanbanBoard key={refreshKey} />}
        {view === 'charts' && <ChartsDashboard />}
      </main>
    </div>
  );
}

export default Dashboard;