import { createLogger, format, transports } from "winston"
const { combine, timestamp, printf, prettyPrint } = format
// Create a logger instance

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${level}] [${timestamp}]: ${message}`
})

const logger = createLogger({
  level: "debug",
  format: combine(
    prettyPrint(),
    timestamp({ format: "DD:MM:YY HH:mm:ss" }),
    myFormat
  ),
  transports: [
    new transports.File({
      format: format.json(),
      filename: "logs/error.log",
      level: "error",
    }),
    new transports.File({
      format: format.json(),
      filename: "logs/combined.log",
    }),
    new transports.Console({
      format: combine(
        format.colorize(),
        timestamp({ format: "DD:MM:YY HH:mm:ss" }),
        myFormat
      ),
    }),
  ],
})

export default logger
