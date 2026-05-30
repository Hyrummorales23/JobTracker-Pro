// models/Job.js - Defines the Job data structure for job applications
const mongoose = require('mongoose');

// Schema for individual job applications
const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  dateApplied: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  link: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Job', jobSchema);