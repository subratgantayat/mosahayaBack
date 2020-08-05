import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import * as Path from 'path';
import Logger from './helper/logger';
import Utils from './helper/utils';
import Plugin from './plugin';
import Router from './router';
import Db from './db';
import Strategy from './strategy';

const PORT: string = Utils.getEnvVariable('PORT', true);
let CORS: any = Utils.getEnvVariable('CORS', true);

CORS = JSON.parse(CORS);
class Server {
    public start = async (): Promise<Hapi.Server> =>{
        try {
            Logger.info(`Hapi base URL: ${__dirname}`);
            this._instance = new Hapi.Server({
                port: PORT,
                routes: {
                    cors: {
                        origin: CORS
                     //   additionalHeaders: ['x-atmosphere-token']
                    },
                    files: {
                        relativeTo: Path.join(__dirname, 'public')
                    },
                    validate: {
                        failAction: async (request: Hapi.Request, h: Hapi.ResponseToolkit, error: Error) => {
                            Logger.debug('Server - request input error: ',error);
                          //  throw Boom.badRequest(`Invalid request payload input`);
                            throw Boom.badRequest(` ${error}`);
                        }
                    }
                }
            });
            Utils.setBaseURL(__dirname);
            await Db.connect();

            await Plugin.registerAll(this._instance);
            await Strategy.registerAll((this._instance));
            await Router.loadRoutes(this._instance);
            await this._instance.start();

            Logger.info('Server - Up and running!');
         /*   if (process.env.IS_PM2) {
                process.send('ready');
            }*/
            return this._instance;
        } catch (error) {
            Logger.error('Server - There was something wrong: ', error);
            process.exit(1);
        }
    };

    public stop = (): Promise<Error | void> =>{
        Logger.info(`Server - Stopping!`);
        return this._instance.stop();
    };

    public recycle = async (): Promise<Hapi.Server> =>{
        await this.stop();
        return await this.start();
    };

    public instance(): Hapi.Server {
        return this._instance;
    }

    public inject = async (options: string | Hapi.ServerInjectOptions): Promise<Hapi.ServerInjectResponse> => {
        return await this._instance.inject(options);
    };

    private _instance: Hapi.Server;
}
export default new Server();
