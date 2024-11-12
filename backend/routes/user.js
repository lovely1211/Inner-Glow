const express = require('express');
const { registerUser, loginUser, updateUser } = require('../controller/user');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/signin', loginUser);
router.put('/:id', updateUser);

module.exports = router;