const axios = require('axios');
const Chat = require('../model/vent'); 

const HF_TOKEN = process.env.HF_TOKEN;

exports.chatWithMe = async (req, res) => {
    const { message, userId } = req.body; 

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
            { inputs: message },
            {
                headers: {
                    'Authorization': `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Extract generated text safely
        const replyText = response.data[0]?.generated_text || "No reply generated";

        // Save chat to the database
        const chat = new Chat({
            userId,
            message,
            reply: replyText, // Ensure this is a string
        });

        await chat.save();
        return res.json({ reply: replyText });
    } catch (error) {
        console.error("Error with Hugging Face API:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "Error communicating with Hugging Face API" });
    }
};

exports.getChatHistory = async (req, res) => {
    const { userId } = req.params;

    try {
        const chatHistory = await Chat.find({ userId }).sort({ timestamp: -1 });
        return res.json(chatHistory);
    } catch (error) {
        console.error('Error fetching chat history:', error.message);
        return res.status(500).json({ error: 'Error fetching chat history' });
    }
};
