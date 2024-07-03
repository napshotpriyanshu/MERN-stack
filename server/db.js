
const mongoose = require('mongoose');
const DB = process.env.MONGODB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB');
    }
};

module.exports = connectDB;
