import winston from 'winston';

// Define console format for better readability
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create logger instance with console transport only
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service: 'hann-nuxt' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
  ],
});

// Create a stream object for morgan or other middleware
export const loggerStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export default logger;
