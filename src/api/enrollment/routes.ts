import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import Handler from './handler';
import Validate from './validate';
const STRING = EXTERNALIZED_STRING.enrollment;

export default class Routes {
    public static register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('EnrollmentRoutes - Start adding enrollment routes.');
            server.route([
                {
                    method: 'POST',
                    path: '/api/v1/enrollment',
                    options: {
                        handler: Handler.create,
                        validate: Validate.create,
                        description: STRING.CREATE,
                        tags: ['api', 'enrollment']
                      //  response: Validate.findResponse
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/enrollment',
                    options: {
                        auth: {
                            strategy: 'admintoken',
                            scope: ['admin']
                        },
                        handler: Handler.findall,
                        validate: Validate.findall,
                        description: STRING.FINDALL,
                        tags: ['api', 'enrollment']
                        //  response: Validate.findResponse
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/enrollment/{id}/{grecaptcharesponse}',
                    options: {
                        handler: Handler.viewForm,
                        validate: Validate.viewForm,
                        description: STRING.VIEW_FORM,
                        tags: ['api', 'enrollment']
                        //  response: Validate.findResponse
                    }
                }
            ]);
            Logger.info('EnrollmentRoutes - Finish adding enrollment routes.');
        } catch (error) {
            Logger.error(`Error in loading EnrollmentRoutes: ${error}`);
            throw error;
        }
    };
}
