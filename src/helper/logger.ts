import * as Winston from 'winston';
import {LoggingWinston}  from '@google-cloud/logging-winston';
import {ConsoleTransportInstance} from 'winston/lib/winston/transports';

export class ApiLogger {
    public static newInstance = (): Winston.Logger =>{
        const loggingWinston: LoggingWinston = new LoggingWinston();
        const consoleTransport: ConsoleTransportInstance = new Winston.transports.Console({
            format: Winston.format.combine(
                Winston.format.colorize(),
                Winston.format.timestamp(),
                Winston.format.align(),
                Winston.format.printf((info: any) => {
                    const {timestamp, level, message, ...args} = info;
                    const ts = timestamp.slice(0, 19).replace('T', ' ');
                    return `${ts} [${level}]: ${message} ${
                        Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
                        }`;
                })
            ),
            level: process.env.LOG_LEVEL || 'info'
        });


        return Winston.createLogger({
            level:  process.env.LOG_LEVEL || 'info',
            transports: [consoleTransport,loggingWinston]
        });
    };
}

export default ApiLogger.newInstance();
