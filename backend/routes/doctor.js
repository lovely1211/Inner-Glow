const express = require('express');
const { registerUser, loginUser, updateUser, getAllUser } = require('../controller/doctor');
const router = express.Router();

router.post('/doctor/signup', registerUser);
router.post('/doctor/signin', loginUser);
router.put('/doctor/:id', updateUser);
router.get('/doctor', getAllUser);

module.exports = router;