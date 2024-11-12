const express = require('express');
const router = express.Router();
const {chatWithMe} = require('../controller/vent')

router.post('/chat', chatWithMe);

module.exports = router;
