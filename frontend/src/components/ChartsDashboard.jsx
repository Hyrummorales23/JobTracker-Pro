// components/ChartsDashboard.jsx - Spotify-inspired charts dashboard
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const statusColors = {
  Wishlist: '#6b7280',
  Applied: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#10b981',
  Rejected: '#ef4444',
};

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

  const getWeeklyData = () => {
    const weeklyMap = new Map();
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (today.getDay() + 7 * i));
      const weekLabel = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      weeklyMap.set(weekLabel, 0);
    }
    
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
    
    return statusCounts;
  };

  const getSuccessRate = () => {
    const total = jobs.length;
    const offers = jobs.filter(job => job.status === 'Offer').length;
    if (total === 0) return 0;
    return Math.round((offers / total) * 100);
  };

  const weeklyData = getWeeklyData();
  const statusData = getStatusData();
  const successRate = getSuccessRate();
  const totalJobs = jobs.length;
  const maxApplications = Math.max(...weeklyData.map(d => d.applications), 1);

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
    <div className="space-y-6">
      {/* Success Rate Card */}
      <div className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] rounded-xl shadow-xl p-6 text-black">
        <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
        <p className="text-5xl font-bold">{successRate}%</p>
        <p className="text-sm opacity-80 mt-2">
          {totalJobs} total applications, {jobs.filter(j => j.status === 'Offer').length} offers
        </p>
      </div>

      {/* Bar Chart - Applications Per Week */}
      <div className="bg-[#181818] rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Applications Per Week</h3>
        {weeklyData.some(d => d.applications > 0) ? (
          <div className="space-y-3">
            {weeklyData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm text-[#B3B3B3] mb-1">
                  <span>{item.name}</span>
                  <span>{item.applications}</span>
                </div>
                <div className="w-full bg-[#282828] rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] h-6 rounded-full flex items-center justify-end pr-2 text-xs text-black font-medium"
                    style={{ width: `${(item.applications / maxApplications) * 100}%` }}
                  >
                    {item.applications > 0 && item.applications}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-[#282828] rounded-lg">
            <p className="text-[#B3B3B3]">No data yet. Add job applications to see charts!</p>
          </div>
        )}
      </div>

      {/* Status Breakdown */}
      <div className="bg-[#181818] rounded-xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Status Breakdown</h3>
        {totalJobs > 0 ? (
          <div className="space-y-3">
            {Object.entries(statusData).map(([status, count]) => (
              count > 0 && (
                <div key={status}>
                  <div className="flex justify-between text-sm text-[#B3B3B3] mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: statusColors[status] }}
                      />
                      <span>{status}</span>
                    </div>
                    <span>{count} ({Math.round((count / totalJobs) * 100)}%)</span>
                  </div>
                  <div className="w-full bg-[#282828] rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(count / totalJobs) * 100}%`,
                        backgroundColor: statusColors[status]
                      }}
                    />
                  </div>
                </div>
              )
            ))}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-[#282828] rounded-lg">
            <p className="text-[#B3B3B3]">No data yet. Add job applications to see charts!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChartsDashboard;