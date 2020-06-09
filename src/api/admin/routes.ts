import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import Handler from './handler';
import Validate from './validate';
const STRING = EXTERNALIZED_STRING.admin;

export default class Routes {
    public static register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('AdminRoutes - Start adding enrollment routes.');
            server.route([
                {
                    method: 'POST',
                    path: '/api/v1/admin/signup',
                    options: {
                        handler: Handler.create,
                        validate: Validate.create,
                        description: STRING.CREATE,
                        tags: ['api', 'admin']
                    }
                },
                {
                    method: 'POST',
                    path: '/api/v1/admin/signin',
                    options: {
                        handler: Handler.signin,
                        validate: Validate.signin,
                        description: STRING.SIGNIN,
                        tags: ['api', 'admin']
                    }
                }
            ]);
            Logger.info('AdminRoutes - Finish adding enrollment routes.');
        } catch (error) {
            Logger.error(`Error in loading AdminRoutes: ${error}`);
            throw error;
        }
    };
}
