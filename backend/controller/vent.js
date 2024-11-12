const axios = require('axios');

const OPENAI_KEY = process.env.OPENAI_API_KEY; 

exports.chatWithMe = async (req, res) => {
    const { message } = req.body;
    console.log("Received message:", message);

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
                    messages: [{ role: 'user', content: message }],
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log("ChatGPT response:", response.data); 
            return res.json({ reply: response.data.choices[0].message.content });
        } catch (error) {
            console.log("ChatGPT API error:", error);
            if (error.response && error.response.status === 429) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempt++;
            } else {
                return res.status(500).json({ error: "Error communicating with ChatGPT API" });
            }
        }
    }

    return res.status(429).json({ error: "Rate limit exceeded, please try again later." });
};

