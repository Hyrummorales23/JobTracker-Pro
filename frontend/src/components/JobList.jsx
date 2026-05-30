// components/JobList.jsx - Displays all job applications for the user
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';

const API_URL = 'http://localhost:5001/api';

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          {jobs.length} {jobs.length === 1 ? 'application' : 'applications'} saved
        </p>
      </div>

      {jobs.length === 0 ? (
        <p className="text-center text-gray-500">No job applications yet. Add your first one!</p>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
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