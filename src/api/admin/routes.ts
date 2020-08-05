import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import PublicHandler from '../../helper/publicHandler';
import Handler from './handler';
import Validate from './validate';
const STRING: any = EXTERNALIZED_STRING.admin;

class Routes {
    public register =  async (server: Hapi.Server): Promise<any> => {
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
                        pre:[
                            { method: PublicHandler.validateCaptchaPayload, assign: 'captcha' }
                        ],
                        handler: Handler.signin,
                        validate: Validate.signin,
                        description: STRING.SIGNIN,
                        tags: ['api', 'admin']
                    }
                }
            ]);
            Logger.info('AdminRoutes - Finish adding enrollment routes.');
        } catch (error) {
            Logger.error('Error in loading AdminRoutes: ', error);
            throw error;
        }
    };
}

export default new Routes();
