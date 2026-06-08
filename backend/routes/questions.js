// routes/questions.js - Handles all question bank operations
const express = require('express');
const jwt = require('jsonwebtoken');
const Question = require('../models/Question');

const router = express.Router();

// Middleware to verify JWT token
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

// GET all questions for logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const questions = await Question.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST - Create a new question
router.post('/', authenticate, async (req, res) => {
  try {
    const { question, category, answer } = req.body;
    
    const newQuestion = new Question({
      question,
      category: category || 'General',
      answer: answer || '',
      userId: req.userId
    });
    
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE - Remove a question
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;