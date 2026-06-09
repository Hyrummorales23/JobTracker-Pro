// config.js - Environment-based API configuration
const isProduction = import.meta.env.PROD;

export const API_URL = isProduction 
  ? 'https://jobtracker-pro-api.onrender.com/api'  // Render URL
  : 'http://localhost:5001/api';