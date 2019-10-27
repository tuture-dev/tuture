import chalk from 'chalk';
import winston, { format } from 'winston';
import { TUTURE_ERROR_LOG } from '../constants';

const logLevels = {
  error: 0,
  warning: 1,
  success: 2,
  info: 3,
};

const consoleFormat = format.printf((info) => {
  const { level, message } = info;
  switch (level) {
    case 'error':
      return `${chalk.red(level)} ${message}`;
    case 'warning':
      return `${chalk.yellow(level)} ${message}`;
    case 'success':
      return `${chalk.green(level)} ${message}`;
    case 'info':
      return `${chalk.blue(level)} ${message}`;
    default:
      return message;
  }
});

const fileFormat = format.printf((info) => {
  const { message, error, timestamp } = info;
  let log = `${timestamp} ${message}\n`;
  if (error) {
    const { message, stack } = error as Error;
    log += `${message}\n${stack}\n`;
  }
  return log;
});

const logger = winston.createLogger({
  levels: logLevels,
  transports: [
    new winston.transports.Console({ level: 'info', format: consoleFormat }),
    new winston.transports.File({
      filename: TUTURE_ERROR_LOG,
      level: 'error',
      format: format.combine(format.timestamp(), fileFormat),
    }),
  ],
});

export default logger;
