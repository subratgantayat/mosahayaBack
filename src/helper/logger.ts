import * as Winston from 'winston';
// import {LoggingWinston}  from '@google-cloud/logging-winston';
import {ConsoleTransportInstance} from 'winston/lib/winston/transports';
import Utils from './utils';
// const NODE_ENV: string = Utils.getEnvVariable('NODE_ENV', true);

export class ApiLogger {
    public newInstance = (): Winston.Logger =>{
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
        const transports: any[] = [consoleTransport];

      /*  if (NODE_ENV !== 'development') {
            const loggingWinston: LoggingWinston = new LoggingWinston();
            transports.push(loggingWinston);
        }*/

        return Winston.createLogger({
            level:  process.env.LOG_LEVEL || 'info',
            transports
        });
    };
}

export default new ApiLogger().newInstance();
