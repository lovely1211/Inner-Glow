const express = require('express');
const router = express.Router();
const {getEmotionsForLastThirtyDays} = require('../controller/chart')
const {generateSuggestion} = require('../controller/mindcare');

router.get('/suggestions/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const emotionData = await getEmotionsForLastThirtyDays(userId);
        const suggestion = await generateSuggestion(emotionData);
        res.json({ suggestion });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error generating suggestion', error });
    }
});

module.exports = router;