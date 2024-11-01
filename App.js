import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from "body-parser";
import adminRoute from "./routes/AdminRoute.js";
import userRoute from "./routes/UserRoute.js";
import categoryRoute from './routes/CategoryRoute.js';
import subCategoryRoute from './routes/SubCategoryRoute.js';
import productRoute from './routes/ProdectRoute.js'; // Correct spelling of 'ProductRoute'
import fileUpload from 'express-fileupload';
import connectDB from './database/dbconfig.js';
import { Server } from 'socket.io'; // Import Socket.IO

// Initialize Express
const app = express();
connectDB(); // Initialize MongoDB connection

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());


// Routes
app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/category", categoryRoute);
app.use("/subCategory", subCategoryRoute);
app.use("/product", productRoute);

// Create HTTP server for Socket.IO integration
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server, {
    cors: {
        origin: '*', // Allow cross-origin requests from all domains
    },
});

// Handle Socket.IO connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for incoming messages from clients
    socket.on('sendMessage', (messageData) => {
        console.log('Message received:', messageData);

        // Broadcast the message to all users except the sender
        socket.broadcast.emit('receiveMessage', messageData);
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 4019;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
