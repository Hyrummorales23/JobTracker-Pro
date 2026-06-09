// components/ChartsDashboard.jsx - Displays charts for job applications
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { API_URL } from '../config';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function ChartsDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

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

  // Calculate applications per week (last 8 weeks)
  const getWeeklyData = () => {
    const weeklyMap = new Map();
    const today = new Date();
    
    // Initialize last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() + 7 * i));
      const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      weeklyMap.set(weekLabel, 0);
    }
    
    // Count applications per week
    jobs.forEach(job => {
      if (job.dateApplied) {
        const jobDate = new Date(job.dateApplied);
        const weekStart = new Date(jobDate);
        weekStart.setDate(jobDate.getDate() - jobDate.getDay());
        const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
        
        if (weeklyMap.has(weekLabel)) {
          weeklyMap.set(weekLabel, weeklyMap.get(weekLabel) + 1);
        }
      }
    });
    
    return Array.from(weeklyMap.entries()).map(([name, applications]) => ({
      name,
      applications
    }));
  };

  // Calculate status breakdown for pie chart
  const getStatusData = () => {
    const statusCounts = {
      Wishlist: 0,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };
    
    jobs.forEach(job => {
      if (statusCounts.hasOwnProperty(job.status)) {
        statusCounts[job.status]++;
      }
    });
    
    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, value]) => ({ name, value }));
  };

  // Calculate success rate
  const getSuccessRate = () => {
    const total = jobs.length;
    const offers = jobs.filter(job => job.status === 'Offer').length;
    if (total === 0) return 0;
    return Math.round((offers / total) * 100);
  };

  const weeklyData = getWeeklyData();
  const statusData = getStatusData();
  const successRate = getSuccessRate();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-center text-gray-500">Loading charts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Rate Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
        <p className="text-4xl font-bold">{successRate}%</p>
        <p className="text-sm opacity-90 mt-2">
          {jobs.length} total applications, {jobs.filter(j => j.status === 'Offer').length} offers
        </p>
      </div>

      {/* Bar Chart - Applications Per Week */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Applications Per Week</h3>
        {weeklyData.some(d => d.applications > 0) ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
            <p className="text-gray-500">No data yet. Add job applications to see charts!</p>
          </div>
        )}
      </div>

      {/* Pie Chart - Status Breakdown */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Breakdown</h3>
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
            <p className="text-gray-500">No data yet. Add job applications to see charts!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartsDashboard;