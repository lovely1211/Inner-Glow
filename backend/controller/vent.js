const axios = require('axios');
const Chat = require('../model/vent'); 

const HF_TOKEN = process.env.HF_TOKEN;

exports.chatWithMe = async (req, res) => {
    const { message, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        let attempt = 0;
        const maxAttempts = 5;
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        
        let response;
        
        while (attempt < maxAttempts) {
            response = await axios.post(
                'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
                { inputs: message },
                {
                    headers: {
                        'Authorization': `Bearer ${HF_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.data.error) {
                break; // Exit loop if no error
            }

            if (response.data.error.includes("currently loading")) {
                const estimatedTime = response.data.estimated_time || 10; // Default to 10 seconds if not provided
                console.log(`Model is loading, retrying in ${Math.ceil(estimatedTime)} seconds...`);
                await delay(estimatedTime * 1000); // Wait for the estimated time
                attempt++;
            } else {
                throw new Error(response.data.error);
            }
        }

        if (response.data.error) {
            return res.status(500).json({ error: response.data.error });
        }

        const replyText = response.data[0]?.generated_text || "No reply generated";

        const chat = new Chat({
            userId,
            message,
            reply: replyText,
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
