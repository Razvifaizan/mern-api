// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: { type: Number, required: true },
    receiverId: { type: Number, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('messages', messageSchema);

export default Message;
