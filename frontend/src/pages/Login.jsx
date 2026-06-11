// pages/Login.jsx - Spotify-inspired Login/Signup page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/signup`;
      const payload = isLogin ? { email, password } : { name, email, password };

      const response = await axios.post(endpoint, payload);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <svg className="w-10 h-10 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <circle cx="12" cy="12" r="4" fill="currentColor"/>
            </svg>
            <h1 className="text-3xl font-bold text-white">JobTracker Pro</h1>
          </div>
          <p className="text-[#B3B3B3] mt-2">Track your job search journey</p>
        </div>

        {/* Card */}
        <div className="bg-[#181818] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="spotify-input"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="spotify-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#B3B3B3] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="spotify-input"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full spotify-button-primary"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Log in' : 'Sign up')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#B3B3B3] hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;