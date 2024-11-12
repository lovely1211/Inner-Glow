const mongoose = require ('mongoose');

const connectDB = async (req, res) => {
    try{
       await mongoose.connect(process.env.MONGO_URL);
       console.log('MongoDB Connected');
    } catch (err){
        console.log("error connecting to Mongo", err);
        process.exit(1);
    }
};

module.exports = connectDB;