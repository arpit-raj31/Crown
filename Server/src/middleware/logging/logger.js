import winston from 'winston';

// Create a custom logger using winston
const logger = winston.createLogger({
  level: 'info', // Default logging level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Timestamp format
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}] : ${message}`;
    })
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({ format: winston.format.simple() }),

    // File transport for production
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});

export default logger;
