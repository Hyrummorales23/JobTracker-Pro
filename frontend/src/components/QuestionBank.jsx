// components/QuestionBank.jsx - Interview question bank
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    question: '',
    category: 'General',
    answer: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load questions
  const loadQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(response.data);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add question
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/questions`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({ question: '', category: 'General', answer: '' });
      setSuccess('Question added!');
      loadQuestions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question');
    }
  };

  // Delete question
  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadQuestions();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading) {
    return <div className="bg-white p-6 rounded-lg shadow">Loading questions...</div>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      {/* Add Question Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Interview Question</h2>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Question *</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              rows="2"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., What is closures in JavaScript?"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="General">General</option>
              <option value="Technical">Technical</option>
              <option value="Behavioral">Behavioral</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Suggested Answer (Optional)</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Add Question
          </button>
        </form>
      </div>

      {/* Questions List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Question Bank</h2>
        <p className="text-sm text-gray-500 mb-4">{questions.length} questions saved</p>
        
        {questions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No questions yet. Add your first interview question!</p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {questions.map((q) => (
              <div key={q._id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        q.category === 'Technical' ? 'bg-blue-100 text-blue-700' :
                        q.category === 'Behavioral' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {q.category}
                      </span>
                    </div>
                    <p className="font-medium text-gray-800">{q.question}</p>
                    {q.answer && (
                      <details className="mt-2">
                        <summary className="text-sm text-blue-600 cursor-pointer">Show answer</summary>
                        <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">{q.answer}</p>
                      </details>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-red-500 hover:text-red-700 text-sm ml-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionBank;