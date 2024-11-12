const Emotion = require('../model/emotion');
const mongoose = require('mongoose');

exports.getEmotionProgress = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Aggregate emotions by date and emotion type
    const emotions = await Emotion.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            emotion: "$emotion",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } } // Sort by date in ascending order
    ]);

    // Format the response to be suitable for the frontend
    const formattedData = emotions.reduce((acc, item) => {
      const { date, emotion } = item._id;
      if (!acc[date]) acc[date] = {};
      acc[date][emotion] = item.count;
      return acc;
    }, {});

    res.status(200).json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching emotion progress" });
  }
};
