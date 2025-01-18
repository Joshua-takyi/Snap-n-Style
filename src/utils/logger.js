// logger.js
import winston from "winston";
import chalk from "chalk";

// Define custom colors for each log level
const customColors = {
	info: "blue",
	error: "red",
	debug: "green",
};

// Add colors to winston
winston.addColors(customColors);

// Create a logger instance
const logger = winston.createLogger({
	levels: winston.config.syslog.levels, // Use syslog levels (includes info, error, debug)
	format: winston.format.combine(
		winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp
		winston.format.printf((log) => {
			// Apply colors to log messages using chalk
			let message = `${log.timestamp} [${log.level.toUpperCase()}]: ${
				log.message
			}`;
			switch (log.level) {
				case "info":
					message = chalk.blue(message);
					break;
				case "error":
					message = chalk.red(message);
					break;
				case "debug":
					message = chalk.green(message);
					break;
				default:
					break;
			}
			return message;
		})
	),
	transports: [
		// Log to the console
		new winston.transports.Console({
			level: "debug", // Log everything up to debug level
		}),
		// Log to a file (optional)
		new winston.transports.File({
			filename: "logs/app.log", // Save logs to a file
			level: "error", // Log only errors to the file
		}),
	],
});

export default logger;
