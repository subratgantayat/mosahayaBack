import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import Handler from './handler';
import Validate from './validate';
import PublicHandler from '../../helper/publicHandler';
const STRING: any = EXTERNALIZED_STRING.employer;

class Routes {
    public register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('EmployerRoutes - Start adding employer routes.');
            server.route([
                {
                    method: 'POST',
                    path: '/api/v1/employer/signup',
                    options: {
                        handler: Handler.create,
                        validate: Validate.create,
                        description: STRING.CREATE,
                        tags: ['api', 'employer']
                    }
                },
                {
                    method: 'POST',
                    path: '/api/v1/employer/signin',
                    options: {
                        pre:[
                            { method: PublicHandler.validateCaptchaPayload, assign: 'captcha' }
                        ],
                        handler: Handler.signin,
                        validate: Validate.signin,
                        description: STRING.SIGNIN,
                        tags: ['api', 'employer']
                    }
                }
            ]);
            Logger.info('EmployerRoutes - Finish adding employer routes.');
        } catch (error) {
            Logger.error('Error in loading EmployerRoutes: ', error);
            throw error;
        }
    };
}

export default new Routes();
