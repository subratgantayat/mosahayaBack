import * as Hapi from '@hapi/hapi';
import Logger from './logger';

export default class Utils {
    public static getUrl(request: Hapi.Request): string {
        return `${request.server.info.uri}${request.url.pathname}`;
    }

    public static getRootUrl(request: Hapi.Request): string {
        return `${request.server.info.uri}`;
    }

    public static async responseFailAction(request: Hapi.Request, h: Hapi.ResponseToolkit, error: Error) {
        Logger.error(`Server - response validation error: ${error}`);
        throw error;
    }

    public static getEnvVariable(name: string, exit: boolean): string | undefined {
        if (!process.env[name]) {
            Logger.error(name + ' environment variable not set');
            if (exit) {
                process.exit(1);
            }
        }
        return process.env[name];
    }

    public static setBaseURL(base_dir: string): void {
        Utils._base_dir = base_dir;
    }

    public static getBaseURL(): string {
        return Utils._base_dir;
    }

    private static _base_dir: string;
}
