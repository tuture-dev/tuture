import chalk from 'chalk';
import winston, { format } from 'winston';

const logLevels = {
  error: 0,
  warning: 1,
  success: 2,
  info: 3,
};

const { printf } = format;

const logFormat = printf((info) => {
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

const logger = winston.createLogger({
  levels: logLevels,
  format: logFormat,
  transports: [new winston.transports.Console({ level: 'info' })],
});

export default logger;
