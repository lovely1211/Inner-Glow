const { HfInference } = require('@huggingface/inference');

// Initialize with your Hugging Face API key
const hf = new HfInference(process.env.HF_TOKEN); // Make sure to set HF_API_KEY in your .env file

const generateSuggestion = async (emotionData) => {
    const emotionsSummary = summarizeEmotions(emotionData);

    // Generate a suggestion using a conversational model
    const response = await hf.textGeneration({
        model: 'gpt2', // Replace with a more suitable conversational model if needed, e.g., 'facebook/blenderbot-400M-distill'
        inputs: `Here's the emotional trend for the last 30 days: ${emotionsSummary}. Generate a personalized suggestion to help the user improve their emotional state.`,
        parameters: { max_length: 150 }, // Adjust the max length as needed
    });

    return response.generated_text;
};

const summarizeEmotions = (emotionData) => {
    const totalDays = 30;
    const emotionCount = {};

    emotionData.forEach((entry) => {
        if (!emotionCount[entry.emotion]) {
            emotionCount[entry.emotion] = 0;
        }
        emotionCount[entry.emotion] += entry.count;
    });

    const summary = Object.entries(emotionCount)
        .map(([emotion, count]) => `${emotion}: ${((count / totalDays) * 100).toFixed(2)}%`)
        .join(', ');

    return summary;
};

module.exports = { generateSuggestion, summarizeEmotions };
