// components/JobList.jsx - Spotify-inspired job list with search/filter
import { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import { API_URL } from '../config';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJobs();
  }, []);

  const handleJobDeleted = (jobId) => {
    setJobs(jobs.filter(job => job._id !== jobId));
  };

  const handleJobUpdated = (updatedJob) => {
    setJobs(jobs.map(job => job._id === updatedJob._id ? updatedJob : job));
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-[#181818] rounded-xl p-8 shadow-xl">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1DB954]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#181818] rounded-xl p-8 shadow-xl">
        <p className="text-center text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] rounded-xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Job Applications</h2>
          <p className="text-sm text-[#B3B3B3] mt-1">
            {jobs.length} {jobs.length === 1 ? 'application' : 'applications'} total
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B3B3B3]">🔍</span>
          <input
            type="text"
            placeholder="Search by company or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="spotify-input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="spotify-select w-full sm:w-48"
        >
          <option value="">All Status</option>
          <option value="Wishlist">⭐ Wishlist</option>
          <option value="Applied">📝 Applied</option>
          <option value="Interview">🎯 Interview</option>
          <option value="Offer">🎉 Offer</option>
          <option value="Rejected">❌ Rejected</option>
        </select>
      </div>

      {filteredJobs.length !== jobs.length && jobs.length > 0 && (
        <p className="text-sm text-[#B3B3B3] mb-3">
          Showing {filteredJobs.length} of {jobs.length} applications
        </p>
      )}

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#B3B3B3]">
            {jobs.length === 0 
              ? "No job applications yet. Add your first one!" 
              : "No matching jobs found. Try a different search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map(job => (
            <JobCard
              key={job._id}
              job={job}
              onJobDeleted={handleJobDeleted}
              onJobUpdated={handleJobUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default JobList;
