const Emotion = require('../model/emotion');

// Function for generating suggestions based on emoji
function getSuggestion(emoji) {
    switch (emoji) {
        case "😊": return "Keep smiling and spread positivity!";
        case "😔": return "Take some time for self-care.";
        case "😠": return "Baby calm down. Try some deep breathing exercises.";
        case "😌": return "Maintain this calmness!";
        case "😖": return "Consider a short break to relax. All is well";
        case "😥": return "Why are you crying, baby? Tell me";
        case "😍": return "Waooo! Today is lovingly fulfilled";
        case "😨": return "Don't feel fear. You can do anything.";
        case "😣": return "What’s troubling you?";
        case "😮": return "Tell me, why are you surprised? May I help you?";
        default: return "Remember, it's okay to feel this way!";
    }
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
        
        // Check if an emotion record already exists for the user today
        const existingRecord = await Emotion.findOne({ userId, date: today });
        if (existingRecord) {
            return res.status(400).json({ message: "Emotion already selected today." });
        }

        // Generate suggestion and create a new emotion record
        const suggestion = getSuggestion(emoji);
        const emotionRecord = new Emotion({ userId, date: today, emotion: emoji, suggestion });
        await emotionRecord.save();

        res.json({ emoji, suggestion });
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

        // Retrieve today's emotion record for the user
        const emotion = await Emotion.findOne({ userId, date: today });
        res.json(emotion || {});  
    } catch (error) {
        console.error('Error occurred in getEmotion:', error);
        res.status(500).json({ message: "An error occurred", error: error.message });
    }
};
