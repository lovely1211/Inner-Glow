const { HfInference } = require('@huggingface/inference');

// Initialize with your Hugging Face API key
const hf = new HfInference(process.env.HF_TOKEN); 

// const generateSuggestion = async (emotionData) => {
//     const emotionsSummary = summarizeEmotions(emotionData);

//     // Generate a suggestion using a conversational model
//     const response = await hf.textGeneration({
//         model: 'gpt2', 
//         inputs: `Here's the emotional trend for the last 30 days: ${emotionsSummary}. Generate a personalized suggestion to help the user improve their emotional state.`,
//         parameters: { max_length: 150 }, 
//     });

//     return response.generated_text;
// };

const generateSuggestion = async (emotionData) => {
    try {
        // Summarize emotions
        const emotionSummary = summarizeEmotions(emotionData);

        // Example suggestion logic
        const highestEmotion = Object.entries(emotionSummary).reduce((max, current) => 
            current[1] > max[1] ? current : max, ['', 0]
        );

        const emotion = highestEmotion[0];

        const response = await hf.textGeneration({
            model: 'gpt2', 
            inputs: `Here's the emotional trend for the last 30 days: ${emotion}. Generate a personalized suggestion to help the user improve their emotional state.`,
        });
    
        return response.generated_text;

    } catch (error) {
        console.error('Error generating suggestion:', error.message);
        throw new Error('Invalid emotion data');
    }
};


const summarizeEmotions = (emotionData) => {
    const validEmotions = ['Happy', 'Sad', 'Angry', 'Surprise', 'Fear', 'Disgust', 'Relaxed', 'Loving', 'Stressed', 'Crying']; 

    emotionData.forEach((entry) => {
        if (
            !entry.day || 
            !entry.name || 
            !validEmotions.includes(entry.name) || 
            typeof entry.count !== 'number' || 
            entry.count < 0 
        ) {
            throw new Error(`Invalid entry in emotion data: ${JSON.stringify(entry)}`);
        }
    });

    // Summarize the emotion data (example logic)
    const summary = emotionData.reduce((acc, entry) => {
        acc[entry.name] = (acc[entry.name] || 0) + entry.count;
        return acc;
    }, {});

    return summary;
};

module.exports = { generateSuggestion, summarizeEmotions };
