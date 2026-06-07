// routes/jobs.js - Handles all job CRUD operations (Create, Read, Update, Delete)
const express = require('express');
const jwt = require('jsonwebtoken');
const Job = require('../models/Job');

const router = express.Router();

// Middleware to verify JWT token and get user ID
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// GET all jobs for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.userId }).sort({ dateApplied: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET a single job by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST - Create a new job application
router.post('/', authenticate, async (req, res) => {
  try {
    const { company, title, dateApplied, status, link, notes } = req.body;
    
    const job = new Job({
      company,
      title,
      dateApplied: dateApplied || new Date(),
      status: status || 'Applied',
      link,
      notes,
      userId: req.userId
    });
    
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT - Update an existing job application
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { company, title, dateApplied, status, link, notes } = req.body;
    
    const job = await Job.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Update fields
    job.company = company || job.company;
    job.title = title || job.title;
    job.dateApplied = dateApplied || job.dateApplied;
    job.status = status || job.status;
    job.link = link || job.link;
    job.notes = notes || job.notes;
    
    await job.save();
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE - Remove a job application
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH - Update just the status of a job (for drag-and-drop)
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    const job = await Job.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    job.status = status;
    await job.save();
    
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;