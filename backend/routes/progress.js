const express = require('express');
const router = express.Router();
const emotionController = require('../controller/progress');

router.get('/progress/:userId', emotionController.getEmotionProgress);

module.exports = router;
