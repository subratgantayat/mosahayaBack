import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';


export default class Controller {
    public static async create(): Promise<any> {
        try {
            return 1;
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    }
}
