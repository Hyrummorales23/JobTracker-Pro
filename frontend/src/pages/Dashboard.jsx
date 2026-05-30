// pages/Dashboard.jsx - Main dashboard after login with job CRUD functionality
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/JobForm';
import JobList from '../components/JobList';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Refresh the job list when a new job is added
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Application Tracker</h2>
          <p className="mt-2 text-gray-600">
            Add and manage your job applications below.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <JobForm onJobAdded={handleJobAdded} />
          <JobList key={refreshKey} />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;