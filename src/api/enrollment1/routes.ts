import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import Handler from './handler';
import Validate from './validate';
import PublicHandler from '../../helper/publicHandler';
import Config from '../../config/config';
const STRING: any = EXTERNALIZED_STRING.enrollment1;

class Routes {
public register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('Enrollment1Routes - Start adding enrollment1 routes.');
            server.route([
                {
                    method: 'POST',
                    path: '/api/v1/enrollment1',
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
                        tags: ['api', 'enrollment1']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/enrollment1',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.find,
                        description: STRING.FIND,
                        validate: Validate.find,
                        tags: ['api', 'enrollment1']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/enrollment1/{id}',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.findOne,
                        validate: Validate.findOne,
                        description: STRING.FIND_ONE,
                        tags: ['api', 'enrollment1']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/enrollment1/self/{id}',
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
                        tags: ['api', 'enrollment1']
                    }
                }
            ]);
            Logger.info('Enrollment1Routes - Finish adding enrollment1 routes.');
        } catch (error) {
            Logger.error('Error in loading Enrollment1Routes: ', error);
            throw error;
        }
    };
}

export default new Routes();
