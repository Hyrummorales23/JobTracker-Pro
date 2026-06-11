// pages/Dashboard.jsx - Spotify-inspired Dashboard with tab navigation
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import JobList from '../components/JobList';
import KanbanBoard from '../components/KanbanBoard';
import ChartsDashboard from '../components/ChartsDashboard';
import QuestionBank from '../components/QuestionBank';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [view, setView] = useState('joblist');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleJobAdded = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const tabs = [
    { id: 'joblist', label: 'Jobs List', icon: '📋' },
    { id: 'kanban', label: 'Kanban Board', icon: '📊' },
    { id: 'charts', label: 'Charts', icon: '📈' },
    { id: 'questions', label: 'Question Bank', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-black border-b border-[#282828] sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <circle cx="12" cy="12" r="4" fill="currentColor"/>
              </svg>
              <h1 className="text-xl font-bold text-white">JobTracker Pro</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[#B3B3B3] hidden sm:inline">Welcome, {user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-[#282828] hover:bg-[#3e3e3e] text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-[#282828] sticky top-[73px] bg-[#121212] z-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                className={`spotify-tab ${view === tab.id ? 'spotify-tab-active' : 'spotify-tab-inactive'}`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
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
        {view === 'questions' && <QuestionBank />}
      </main>
    </div>
  );
}

export default Dashboard;