// components/JobCard.jsx - Displays a single job application
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

function JobCard({ job, onJobDeleted, onJobUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    title: job.title,
    dateApplied: job.dateApplied?.split('T')[0] || '',
    status: job.status,
    link: job.link || '',
    notes: job.notes || ''
  });
  const [loading, setLoading] = useState(false);

  // Handle edit input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update job
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/jobs/${job._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      if (onJobUpdated) onJobUpdated(response.data);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const handleDelete = async () => {
    if (!confirm('Delete this job application?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/jobs/${job._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onJobDeleted) onJobDeleted(job._id);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Status color mapping
  const statusColors = {
    Wishlist: 'bg-gray-100 text-gray-700',
    Applied: 'bg-blue-100 text-blue-700',
    Interview: 'bg-yellow-100 text-yellow-700',
    Offer: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700'
  };

  if (isEditing) {
    return (
      <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3">
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2"
            placeholder="Company"
          />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2"
            placeholder="Job Title"
          />
          <input
            type="date"
            name="dateApplied"
            value={formData.dateApplied}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="Wishlist">Wishlist</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2"
            rows="2"
            placeholder="Notes"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="rounded-md bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company}</p>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${statusColors[job.status] || 'bg-gray-100 text-gray-700'}`}>
          {job.status}
        </span>
      </div>
      
      <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-gray-700">Date Applied:</span>{' '}
          {job.dateApplied ? new Date(job.dateApplied).toLocaleDateString() : 'N/A'}
        </p>
        <p>
          <span className="font-medium text-gray-700">Job Link:</span>{' '}
          {job.link ? <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a> : 'N/A'}
        </p>
      </div>
      
      {job.notes && (
        <div className="mt-4 rounded-md bg-gray-50 p-3">
          <h4 className="text-sm font-semibold text-gray-700">Notes</h4>
          <p className="mt-1 text-sm text-gray-600">{job.notes}</p>
        </div>
      )}
      
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-blue-600 hover:underline"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-sm text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default JobCard;