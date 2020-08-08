import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import Handler from './handler';
import Validate from './validate';
import PublicHandler from '../../helper/publicHandler';
import Config from '../../config/config';
const STRING: any = EXTERNALIZED_STRING.enrollment;

class Routes {
public register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('EnrollmentRoutes - Start adding enrollment routes.');
            server.route([
                {
                    method: 'POST',
                    path: '/api/v1/enrollment',
                    options: {
                        app:{
                            captchaAction: 'register',
                            captchaScore: Config.captchaScore,
                            captchaIn: 'payload'
                        },
                        pre:[
                            { method: PublicHandler.validateCaptchaInput, assign: 'captcha' }
                        ],
                        handler: Handler.create,
                        validate: Validate.create,
                        description: STRING.CREATE,
                        tags: ['api', 'enrollment']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/enrollment/search',
                    options: {
                        auth: {
                            strategy: 'admintoken',
                            scope: ['company']
                        },
                        app:{
                            captchaAction: 'enrollment_search',
                            captchaScore: 0,
                            captchaIn: 'query'
                        },
                        pre:[
                            { method: PublicHandler.validateCaptchaInput, assign: 'captcha' }
                        ],
                        handler: Handler.findall,
                        validate: Validate.findall,
                        description: STRING.FINDALL,
                        tags: ['api', 'enrollment']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/enrollment/{id}',
                    options: {
                        app:{
                            captchaAction: 'register',
                            captchaScore: Config.captchaScore,
                            captchaIn: 'query'
                        },
                        pre:[
                            { method: PublicHandler.validateCaptchaInput, assign: 'captcha' }
                        ],
                        handler: Handler.viewForm,
                        validate: Validate.viewForm,
                        description: STRING.VIEW_FORM,
                        tags: ['api', 'enrollment']
                    }
                }
            ]);
            Logger.info('EnrollmentRoutes - Finish adding enrollment routes.');
        } catch (error) {
            Logger.error('Error in loading EnrollmentRoutes: ', error);
            throw error;
        }
    };
}

export default new Routes();
