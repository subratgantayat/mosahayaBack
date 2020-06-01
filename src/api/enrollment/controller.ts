import * as Boom from '@hapi/boom';
import Logger from '../../helper/logger';


export default class Controller {
    public static create = async (): Promise<any> =>{
        try {
            return 1;
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}
