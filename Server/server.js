import express from 'express';
import http from 'http';
// import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/database.js';
import routes from './src/routes/index.js';
// import { startLiveMarketFeed } from './src/controllers/MarketdataController.js';
// import "./src/Job/tradeCron.js";
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

// const io = new Server(server, {
//     cors: {
//         origin: process.env.CLIENT_URL, 
//         methods: ['GET', 'POST'],
//         allowedHeaders: ["my-custom-header"],
//     credentials: true,
//     }
// });

app.use(cors({
    origin:  process.env.CLIENT_URL,
    methods: ['GET', 'POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));
  app.use(express.json());






// io.on('connection', (socket) => {


   
//      startLiveMarketFeed(socket);

//     socket.on('disconnect', () => {
      
//     });
// });


// app.get('/api/market/live', (req, res) => {
//     res.send({ message: 'Live market data is being broadcasted via WebSocket.' });
// });


app.use('/', routes);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    console.log(`Server running on http://localhost:${PORT}`);
});