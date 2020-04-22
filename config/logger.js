const { transports, Logger } = require('winston');
const WinstonDailyRotateFile = require('winston-daily-rotate-file');
const moment = require('moment');

const env = process.env.ENV || 'development';
const { toUTCDate, getAppName } = rootRequire('utils');

const appName = getAppName();

const currentTransports = [
  new transports.Console({
    colorize: true,
    timestamp: toUTCDate(moment().format()),
    handleExceptions: false,
    json: false,
    level: 'debug',
    formatter: (options) => {
      // if (/notification/.test(options.message)) return '';
      const meta = (options.meta && Object.keys(options.meta).length ? `\n\t ${JSON.stringify(options.meta)}` : '');
      return `${toUTCDate(moment().format())} - ${appName} - ${options.level.toUpperCase()} - ${undefined !== options.message ? options.message : ''} - ${meta}`;
    },
  })
];

const logginLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
};

const logger = new Logger({
  transports: currentTransports,
  levels: logginLevels.levels,
  exitOnError: false,
});

module.exports = logger;

module.exports.stream = {
  write: (message) => {
    logger.info(message);
  },
};