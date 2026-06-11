// components/QuestionBank.jsx - Spotify-inspired interview question bank
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadQuestions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.question.trim()) {
      setError('Question is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/questions`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({ question: '', category: 'General', answer: '' });
      setSuccess('Question added successfully!');
      loadQuestions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add question');
    }
  };

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
      setError('Failed to delete question');
    }
  };

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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
      {/* Add Question Form */}
      <div className="bg-[#181818] rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>❓</span> Add Interview Question
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
          <div>
            <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Question *</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              rows="3"
              className="spotify-input resize-none"
              placeholder="e.g., What is closures in JavaScript?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="spotify-select"
            >
              <option value="General">📌 General</option>
              <option value="Technical">💻 Technical</option>
              <option value="Behavioral">🗣️ Behavioral</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Suggested Answer (Optional)</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows="4"
              className="spotify-input resize-none"
              placeholder="Write a sample answer to help you prepare..."
            />
          </div>
          
          <button type="submit" className="w-full spotify-button-primary">
            Add Question
          </button>
        </form>
      </div>

      {/* Questions List */}
      <div className="bg-[#181818] rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-2">My Question Bank</h2>
        <p className="text-sm text-[#B3B3B3] mb-4">
          {questions.length} {questions.length === 1 ? 'question' : 'questions'} saved
        </p>
        
        {questions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-[#282828] rounded-lg">
            <p className="text-[#B3B3B3]">No questions yet.</p>
            <p className="text-sm text-[#B3B3B3] mt-1">
              Add your first interview question using the form on the left.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {questions.map((q) => (
              <div key={q._id} className="bg-[#282828] rounded-xl p-4 hover:bg-[#3e3e3e] transition-all">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        q.category === 'Technical' ? 'bg-blue-500/20 text-blue-300' :
                        q.category === 'Behavioral' ? 'bg-green-500/20 text-green-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {q.category === 'Technical' && '💻'} 
                        {q.category === 'Behavioral' && '🗣️'} 
                        {q.category === 'General' && '📌'} {q.category}
                      </span>
                    </div>
                    <p className="font-medium text-white">{q.question}</p>
                    {q.answer && (
                      <details className="mt-3">
                        <summary className="text-sm text-[#1DB954] cursor-pointer hover:text-[#1ed760]">
                          Show answer
                        </summary>
                        <p className="mt-2 text-sm text-[#B3B3B3] bg-[#181818] p-3 rounded-lg border border-[#3e3e3e]">
                          {q.answer}
                        </p>
                      </details>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(q._id)}
                    className="text-red-400 hover:text-red-300 text-sm transition"
                  >
                    🗑️
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
