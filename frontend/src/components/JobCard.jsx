// components/JobCard.jsx - Spotify-inspired job card with edit/delete
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

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

  const statusIcons = {
    Wishlist: '⭐',
    Applied: '📝',
    Interview: '🎯',
    Offer: '🎉',
    Rejected: '❌'
  };

  const statusColors = {
    Wishlist: 'bg-gray-500/20 text-gray-300 border-gray-500',
    Applied: 'bg-blue-500/20 text-blue-300 border-blue-500',
    Interview: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
    Offer: 'bg-green-500/20 text-green-300 border-green-500',
    Rejected: 'bg-red-500/20 text-red-300 border-red-500',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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

  if (isEditing) {
    return (
      <div className="bg-[#282828] rounded-xl p-4 border border-[#3e3e3e]">
        <div className="grid gap-3">
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="spotify-input"
            placeholder="Company"
          />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="spotify-input"
            placeholder="Job Title"
          />
          <input
            type="date"
            name="dateApplied"
            value={formData.dateApplied}
            onChange={handleChange}
            className="spotify-input"
          />
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
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="spotify-input"
            rows="2"
            placeholder="Notes"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-[#1DB954] text-black font-medium py-2 rounded-full hover:bg-[#1ed760] transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-[#282828] text-white py-2 rounded-full hover:bg-[#3e3e3e] transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  let linkUrl = job.link;
  if (linkUrl && !linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
    linkUrl = 'https://' + linkUrl;
  }

  return (
    <div className="bg-[#282828] rounded-xl p-4 hover:bg-[#3e3e3e] transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="text-lg font-semibold text-white">{job.title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[job.status]}`}>
              {statusIcons[job.status]} {job.status}
            </span>
          </div>
          <p className="text-[#B3B3B3] text-sm">{job.company}</p>
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#B3B3B3]">
        {job.dateApplied && (
          <span>📅 Applied: {new Date(job.dateApplied).toLocaleDateString()}</span>
        )}
        {linkUrl && (
          <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-[#1DB954] hover:underline">
            🔗 Job Link
          </a>
        )}
      </div>
      
      {job.notes && (
        <div className="mt-3 pt-3 border-t border-[#3e3e3e]">
          <p className="text-sm text-[#B3B3B3]">
            <span className="font-medium text-white">📝 Notes:</span> {job.notes}
          </p>
        </div>
      )}
      
      <div className="mt-3 flex gap-3">
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm text-[#B3B3B3] hover:text-white transition"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default JobCard;
