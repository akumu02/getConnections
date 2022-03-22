const winston = require('winston');

const transports = [
  new winston.transports.File({
        filename: global.appRoot + "/logs/" + global.config.instance + '.log',
        maxsize: global.config.logs.maxSize,
        maxFiles: global.config.logs.maxFiles,
        level: global.config.logs.level
    }),
];

const logger = winston.createLogger({
    level: global.config.logs.level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.printf(info => `${info.timestamp} ${info.level.toUpperCase()} : ${JSON.stringify(info)}`)),
    defaultMeta: {
        service: global.config.name,
        version: global.config.version,
        instance: global.config.instance
    },
    transports: transports,
    exitOnError: false
});

module.exports = logger;