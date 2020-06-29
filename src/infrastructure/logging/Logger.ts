import { createLogger, format, transports } from 'winston';
import Nconf from '../Nconf';
import { TransformableInfo } from 'logform';

const { combine, timestamp, colorize } = format;
const errorStackFormat = format((info: TransformableInfo) => {

    if (info?.isAxiosError) {
        const logEntry = Object.assign({}, info, {
            stack: info.stack,
            message: {
                msg: info.message,
                response: info.response.data
            },
        });
        delete logEntry.config;
        return logEntry;
    }

    return info;
});

const logger = createLogger({
    level: Nconf.get('logger:level'),
    exitOnError: false,
    format: combine(
        timestamp(),
        colorize(),
        format.splat(),
        errorStackFormat(),
        format.json()
    ),
    defaultMeta: { service: 'shop-apotheke-task' },
    transports: [
        new transports.File(
            { filename: 'error.log', level: Nconf.get('logger:fileLevel') }),
    ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple(),
    }));
}

export default logger;
