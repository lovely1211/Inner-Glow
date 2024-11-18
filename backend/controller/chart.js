const Emotion = require('../model/emotion');
const mongoose = require('mongoose');

const getEmotionsForLastSevenDays = async (userId) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Fetch emotions for the past 7 days
    const emotions = await Emotion.find({
        userId: userId,
        date: { $gte: sevenDaysAgo, $lt: today }
    }).sort({ date: 1 });

    // Map and count occurrences of each emotion per day
    const dailyEmotions = {};
    emotions.forEach(emotion => {
        const dateKey = emotion.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        if (!dailyEmotions[dateKey]) {
            dailyEmotions[dateKey] = {};
        }
        if (!dailyEmotions[dateKey][emotion.emotion]) {
            dailyEmotions[dateKey][emotion.emotion] = 0;
        }
        dailyEmotions[dateKey][emotion.emotion]++;
    });

    // Create an array format suitable for charting
    const result = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        const emotionsCount = dailyEmotions[dateKey] || {};
        if (Object.keys(emotionsCount).length === 0) {
            result.push({ day: dateKey, emotion: 'undefined', count: 0 });
        } else {
            Object.entries(emotionsCount).forEach(([emotion, count]) => {
                result.push({ day: dateKey, emotion, count });
            });
        }
    }

    return result;
};

const getEmotionsForLastThirtyDays = async (userId) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 30);

    // Assuming your Emotion model has fields userId, date, and emoji
    const emotions = await Emotion.find({
        userId: userId,
        date: { $gte: sevenDaysAgo, $lt: today }
    }).sort({ date: 1 }); 

    // Map the results to count occurrences of each emoji per day
    const dailyEmotions = {};
    emotions.forEach(emotion => {
        const dateKey = emotion.date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
        if (!dailyEmotions[dateKey]) {
            dailyEmotions[dateKey] = {};
        }
        if (!dailyEmotions[dateKey][emotion.emoji]) {
            dailyEmotions[dateKey][emotion.emoji] = 0;
        }
        dailyEmotions[dateKey][emotion.emoji]++;
    });

    // Convert the dailyEmotions object to an array format suitable for the chart
    const result = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];

        const emojisCount = dailyEmotions[dateKey] || {};
        Object.entries(emojisCount).forEach(([emoji, count]) => {
            result.push({ day: dateKey, emotion: emoji, count });
        });
    }

    return result;
};

module.exports = {
    getEmotionsForLastSevenDays,
    getEmotionsForLastThirtyDays,
};
