const express = require('express');
const router = express.Router();
const { emotionUser, getEmotion } = require('../controller/emotion');
const authMiddleware = require('../middleware/error');

// Apply authMiddleware to the routes
router.post('/emotion', authMiddleware, emotionUser);
router.get('/emotion/today/:id', authMiddleware, getEmotion);

module.exports = router;
