// components/JobForm.jsx - Spotify-inspired form to add job applications
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function JobForm({ onJobAdded }) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    dateApplied: '',
    status: 'Applied',
    link: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/jobs`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({
        company: '',
        title: '',
        dateApplied: '',
        status: 'Applied',
        link: '',
        notes: ''
      });
      
      setSuccess('Job added successfully!');
      if (onJobAdded) onJobAdded(response.data);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181818] rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span>➕</span> Add Job Application
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-[#1DB954]/10 border border-[#1DB954] rounded-lg text-[#1DB954] text-sm">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="spotify-input"
              placeholder="e.g., Google"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Job Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="spotify-input"
              placeholder="e.g., Frontend Developer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Date Applied</label>
            <input
              type="date"
              name="dateApplied"
              value={formData.dateApplied}
              onChange={handleChange}
              className="spotify-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="spotify-select"
            >
              <option value="Wishlist">⭐ Wishlist</option>
              <option value="Applied">📝 Applied</option>
              <option value="Interview">🎯 Interview</option>
              <option value="Offer">🎉 Offer</option>
              <option value="Rejected">❌ Rejected</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Job Link</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="spotify-input"
            placeholder="https://example.com/job"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="spotify-input resize-none"
            placeholder="Interview notes, recruiter contacts, salary info..."
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full spotify-button-primary"
        >
          {loading ? 'Saving...' : 'Save Job'}
        </button>
      </form>
    </div>
  );
}

export default JobForm;