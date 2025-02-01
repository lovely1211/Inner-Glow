const express = require('express');
const router = express.Router();
const { getEmotionsForLastThirtyDays } = require('../controller/chart');
const { generateSuggestion } = require('../controller/mindcare');

// Route to generate suggestions based on emotions for the last 30 days
router.get('/suggestions/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Fetch emotion data for the last 30 days
        const emotionData = await getEmotionsForLastThirtyDays(userId);
        
        if (!emotionData || emotionData.length === 0) {
            return res.status(404).json({ message: 'No emotion data found for the user' });
        }

        // Generate a suggestion based on the emotion data
        const suggestion = await generateSuggestion(emotionData);

        res.status(200).json({ suggestion });
    } catch (error) {
        console.error('Error generating suggestion:', error.message);

        res.status(500).json({
            message: 'Error generating suggestion',
            error: error.message || 'Internal Server Error',
        });
    }
});

module.exports = router;
