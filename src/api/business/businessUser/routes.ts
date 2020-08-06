import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../../assets/string-constants';
import Logger from '../../../helper/logger';
import Handler from './handler';
import Validate from './validate';
import PublicHandler from '../../../helper/publicHandler';
const STRING: any = EXTERNALIZED_STRING.business.businessUser;

class Routes {
    public register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('BusinessUserRoutes - Start adding businessUser routes.');
            server.route([
                {
                    method: 'GET',
                    path: '/api/v1/business/user/checkemailexist',
                    options: {
                        pre:[
                            { method: PublicHandler.validateCaptchaQuery, assign: 'captcha' }
                        ],
                        handler: Handler.checkEmailExist,
                        validate: Validate.checkEmailExist,
                        description: STRING.EMAIL_EXIST,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'POST',
                    path: '/api/v1/business/user/signup',
                    options: {
                        pre:[
                            { method: PublicHandler.validateCaptchaPayload, assign: 'captcha' }
                        ],
                        handler: Handler.signup,
                        validate: Validate.signup,
                        description: STRING.SIGNUP,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'POST',
                    path: '/api/v1/business/user/signin',
                    options: {
                        pre:[
                            { method: PublicHandler.validateCaptchaPayload, assign: 'captcha' }
                        ],
                        handler: Handler.signin,
                        validate: Validate.signin,
                        description: STRING.SIGNIN,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/user/verifytoken',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.verifyToken,
                        description: STRING.VERIFY_TOKEN,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'POST',
                    path: '/api/v1/business/user/changepassword',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.changePassword,
                        validate: Validate.changePassword,
                        description: STRING.CHANGE_PASSWORD,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'PUT',
                    path: '/api/v1/business/user/self/profile',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.profileEdit,
                        validate: Validate.profileEdit,
                        description: STRING.PROFILE_EDIT,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/user/self/profile',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.profile,
                        description: STRING.PROFILE_GET,
                        tags: ['api', 'businessUser']
                    }
                }
            ]);
            Logger.info('BusinessUserRoutes - Finish adding businessUser routes.');
        } catch (error) {
            Logger.error(`Error in loading BusinessUserRoutes: ${error}`);
            throw error;
        }
    };
}

export default new Routes();
