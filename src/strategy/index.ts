import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Config from '../config/config';
import Logger from '../helper/logger';

export default class Strategies {
    public static registerAll = async (server: Hapi.Server): Promise<Error | any> => {
        // tslint:disable-next-line:no-empty
        try {

        } catch (error) {
            Logger.error(`Error in registering strategies: ${error}`);
            throw error;
        }
    };
}
