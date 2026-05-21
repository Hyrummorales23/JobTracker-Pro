// pages/Dashboard.jsx - Main dashboard after login (placeholder for Sprint 1)
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">JobTracker Pro</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.name}!</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Sprint 1 placeholder */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Sprint 1 Complete! ✅
          </h2>
          <p className="text-gray-600">
            Authentication is working. You can now sign up and log in.
          </p>
          <p className="text-gray-500 mt-4">
            Sprint 2 will add: Job CRUD, Notes, and Dashboard charts.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;