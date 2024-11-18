const express = require('express');
const router = express.Router();
const {chatWithMe, getChatHistory} = require('../controller/vent')

router.post('/chat', chatWithMe);
router.get('/chat/:userId', getChatHistory);

module.exports = router;
