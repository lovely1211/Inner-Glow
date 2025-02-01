const Emotion = require('../model/emotion');

// Mapping of emojis to their names and suggestions
const emojiData = {
    "😊": { name: "Happy", suggestion: "Keep smiling and spread positivity!" },
    "😔": { name: "Sad", suggestion: "Take some time for self-care." },
    "😠": { name: "Angry", suggestion: "Baby calm down. Try some deep breathing exercises." },
    "😌": { name: "Relaxed", suggestion: "Maintain this calmness!" },
    "😖": { name: "Stressed", suggestion: "Consider a short break to relax. All is well" },
    "😥": { name: "Crying", suggestion: "Why are you crying, baby? Tell me" },
    "😍": { name: "Loving", suggestion: "Waooo! Today is lovingly fulfilled" },
    "😨": { name: "Fear", suggestion: "Don't feel fear. You can do anything." },
    "😣": { name: "Disgust", suggestion: "What’s troubling you?" },
    "😮": { name: "Surprise", suggestion: "Tell me, why are you surprised? May I help you?" },
};

// Function to get emoji details (name and suggestion)
function getEmojiDetails(emoji) {
    return emojiData[emoji] || { name: "Unknown", suggestion: "Remember, it's okay to feel this way!" };
}

// Handler to save the user's emotion for the day
exports.emotionUser = async (req, res) => {
    try {
        const { emoji } = req.body;
        const userId = req.user.id; 
        const today = new Date().toISOString().split("T")[0];  

        if (!emoji) {
            return res.status(400).json({ message: "Emoji is required." });
        }
        
        const existingRecord = await Emotion.findOne({ userId, date: today });
        if (existingRecord) {
            return res.status(400).json({ message: "Emotion already selected today." });
        }

        const { name, suggestion } = getEmojiDetails(emoji);
        const emotionRecord = new Emotion({ userId, date: today, emotion: emoji, name, suggestion });
        await emotionRecord.save();

        res.json({ emoji, name, suggestion });
    } catch (error) {
        console.error('Error occurred in emotionUser:', error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Handler to retrieve the user's emotion for today
exports.getEmotion = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date().toISOString().split("T")[0];

        const emotion = await Emotion.findOne({ userId, date: today });
        res.json(emotion || {});  
    } catch (error) {
        console.error('Error occurred in getEmotion:', error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
