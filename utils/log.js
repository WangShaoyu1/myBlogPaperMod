// logger.js
import {createLogger, format, transports} from 'winston';
import path from 'path';
import {fileURLToPath} from "url";
// 获取当前模块文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a logger instance
const logger = createLogger({
    level: 'info', // Set the log level
    format: format.combine(
        format.timestamp(), // Include a timestamp
        format.json() // Log as JSON
    ),
    transports: [
        new transports.File({
            filename: path.join(__dirname, 'logs', 'app.log'), // Log file path
            level: 'info' // Only log info and above
        }),
        new transports.File({
            filename: path.join(__dirname, 'logs', 'error.log'), // Error log file path
            level: 'error' // Only log errors
        })
    ]
});

// If you want to log to the console as well (optional)
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple() // Log format for console
    }));
}

// Function to log messages
export const logMessage = (level, message) => {
    logger.log({level, message});
};

// Optional: Function to log errors
export const logError = (message) => {
    logger.error(message);
};

export default logger;
