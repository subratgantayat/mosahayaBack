import * as Boom from '@hapi/boom';
import Logger from '../../helper/logger';

class Controller {
    public create = async (): Promise<any> =>{
        try {
            return 1;
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };
}

export default new Controller();
