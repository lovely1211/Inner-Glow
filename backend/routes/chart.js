// chart.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/error');
const { getEmotionsForLastSevenDays, getEmotionsForLastThirtyDays } = require('../controller/chart');

// Route for fetching last seven days of emotions
router.get('/emotion/last-seven-days/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid userId format');
        }
        const emotions = await getEmotionsForLastSevenDays(userId);
        res.status(200).json(emotions);
    } catch (error) {
        console.error('Error fetching last seven days of emotions:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route for fetching last thirty days of emotions
router.get('/emotion/last-thirty-days/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid userId format');
        }

        const emotions = await getEmotionsForLastThirtyDays(userId);
        res.status(200).json(emotions);
    } catch (error) {
        console.error('Error fetching last thirty days of emotions:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
