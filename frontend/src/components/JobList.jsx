// components/JobList.jsx - Displays all job applications for the user with search & filter
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

import { API_URL } from '../config';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Load jobs from backend
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

  // Load jobs when component mounts
  useEffect(() => {
    loadJobs();
  }, []);

  // Handle job deletion
  const handleJobDeleted = (jobId) => {
    setJobs(jobs.filter(job => job._id !== jobId));
  };

  // Handle job update
  const handleJobUpdated = (updatedJob) => {
    setJobs(jobs.map(job => job._id === updatedJob._id ? updatedJob : job));
  };

  // Filter jobs based on search term and status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <section className="rounded-lg bg-white p-6 shadow">
        <p className="text-center text-gray-500">Loading jobs...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-lg bg-white p-6 shadow">
        <p className="text-center text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Job Applications</h2>
        <p className="mt-1 text-sm text-gray-600">
          {jobs.length} {jobs.length === 1 ? 'application' : 'applications'} total
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by company or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="Wishlist">Wishlist</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Show filter results count */}
      {filteredJobs.length !== jobs.length && (
        <p className="text-sm text-gray-500 mb-3">
          Showing {filteredJobs.length} of {jobs.length} applications
        </p>
      )}

      {filteredJobs.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          {jobs.length === 0 
            ? "No job applications yet. Add your first one!" 
            : "No matching jobs found. Try a different search or filter."}
        </p>
      ) : (
        <div className="space-y-4">
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
    </section>
  );
}

export default JobList;