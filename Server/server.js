import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/database.js';
import routes from './src/routes/index.js';
import logger from './src/middleware/logging/logger.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Connect to Database
(async () => {
    try {
        await connectDB();
        logger.info('Connected to the database');
    } catch (err) {
        logger.error('Error connecting to the database:', err.message);
        process.exit(1); // Exit process if DB connection fails
    }
})();

// ✅ Fix CORS issue
const allowedOrigins = ['https://forexlife.netlify.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/', routes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log(`Server running on http://localhost:${PORT}`);
});
