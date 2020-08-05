import * as Hapi from '@hapi/hapi';
import {hashSync, compareSync} from 'bcrypt';
import Logger from './logger';

class Utils {
    public getUrl = (request: Hapi.Request): string =>{
        return `${request.server.info.uri}${request.url.pathname}`;
    };

    public getRootUrl = (request: Hapi.Request): string =>{
        return `${request.server.info.uri}`;
    };

    public responseFailAction = async (request: Hapi.Request, h: Hapi.ResponseToolkit, error: Error) => {
        Logger.error('Server - response validation error: ', error);
        throw error;
    };

    public getEnvVariable = (name: string, exit: boolean): string | undefined => {
        if (!process.env[name]) {
            Logger.error(name + ' environment variable not set');
            if (exit) {
                process.exit(1);
            }
        }
        return process.env[name];
    };

    public setBaseURL = (base_dir: string): void  =>{
        this._base_dir = base_dir;
    };

    public getBaseURL = (): string =>{
        return this._base_dir;
    };

    public encrypt = (password: string): string =>{
        return hashSync(password,10);
    };

    public comparePassword = (password: string, passwordRef: string): boolean =>{
        return compareSync(password,passwordRef);
    };

    private _base_dir: string;
}

export default new Utils();
