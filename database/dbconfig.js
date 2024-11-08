import mongoose from 'mongoose';

const connectDB = () => {
    const mongodbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Mystore';

    mongoose.connect(mongodbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increase timeout for slow connections
    })
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(error => {
        console.error('❌ MongoDB connection failed:', error.message || error);
        process.exit(1); // Exit if connection fails
    });
};

export default connectDB;
