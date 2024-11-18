const Emotion = require('../model/emotion');
const mongoose = require('mongoose');

exports.getEmotionProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Aggregate emotions to calculate the total count of each emotion type
    const emotions = await Emotion.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$emotion",
          count: { $sum: 1 },
        },
      },
    ]);

    // Calculate the total count of all emotions combined
    const totalEmotions = emotions.reduce((sum, item) => sum + item.count, 0);

    // Format the response for the frontend
    const formattedData = emotions.map(item => ({
      emotion: item._id,
      count: item.count,
      percentage: ((item.count / totalEmotions) * 100).toFixed(2), // Calculate percentage
    }));

    res.status(200).json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching emotion progress" });
  }
};
