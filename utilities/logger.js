const winston = require('winston');

//Extract formatting utilities
const {
    combine,
    printf,
    colorize,
    timestamp,
    errors
} = winston.format;

//Custom log format
const logFormat = printf(
    ({level,timestamp,message,stack,}) => {
        return `${timestamp} [${level}]: ${stack || message}`
    }
);

//Create Logger
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        errors({stack: true}),
        logFormat
    ),
    transports: [
        // Error logs
        new winston.transports.File({
            filename: './logs/error.log',
            level: 'error'
        }),
        // All logs
        new winston.transports.File({
            filename: './logs/combined.log'
        })
    ]
});

//Console logging in development
if(process.env.NODE_ENV !== 'production'){
    logger.add(
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                errors({stack: true}),
                logFormat
            )
        })
    )
}

module.exports = logger;
