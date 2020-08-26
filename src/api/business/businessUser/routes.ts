import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../../assets/string-constants';
import Logger from '../../../helper/logger';
import Handler from './handler';
import Validate from './validate';
/*import PublicHandler from '../../../helper/publicHandler';
import Config from '../../../config/config';*/
const STRING: any = EXTERNALIZED_STRING.business.businessUser;

class Routes {
    public register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('BusinessUserRoutes - Start adding businessUser routes.');
            server.route([
              /*  {
                    method: 'GET',
                    path: '/api/v1/business/user/check-email-exist',
                    options: {
                        app:{
                           captchaAction: 'business_email_exist',
                            captchaScore: Config.captchaScore,
                            captchaIn: 'query'
                        },
                        pre:[
                            { method: PublicHandler.validateCaptchaInput, assign: 'captcha' }
                        ],
                        handler: Handler.checkEmailExist,
                        validate: Validate.checkEmailExist.input,
                        response: Validate.checkEmailExist.output,
                        description: STRING.EMAIL_EXIST,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'POST',
                    path: '/api/v1/business/user/signup',
                    options: {
                        app:{
                            captchaAction: 'business_signup',
                            captchaScore: Config.captchaScore,
                            captchaIn: 'payload'
                        },
                        pre:[
                            { method: PublicHandler.validateCaptchaInput, assign: 'captcha' }
                        ],
                        handler: Handler.signup,
                        validate: Validate.signup.input,
                        response: Validate.signup.output,
                        description: STRING.SIGNUP,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'POST',
                    path: '/api/v1/business/user/signin',
                    options: {
                        app:{
                            captchaAction: 'business_signin',
                            captchaScore: Config.captchaScore,
                            captchaIn: 'payload'
                        },
                        pre:[
                            { method: PublicHandler.validateCaptchaInput, assign: 'captcha' }
                        ],
                        handler: Handler.signin,
                        validate: Validate.signin.input,
                        response: Validate.signin.output,
                        description: STRING.SIGNIN,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'POST',
                    path: '/api/v1/business/user/changepassword',
                    options: {
                        auth: {
                            strategy: 'business-user',
                            scope: ['business']
                        },
                        handler: Handler.changePassword,
                        validate: Validate.changePassword.input,
                        response: Validate.changePassword.output,
                        description: STRING.CHANGE_PASSWORD,
                        tags: ['api', 'businessUser']
                    }
                },*/
                {
                    method: 'GET',
                    path: '/api/v1/business/user/verifytoken',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.verifyToken,
                        response: Validate.verifyToken.output,
                        description: STRING.VERIFY_TOKEN,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'PUT',
                    path: '/api/v1/business/user/profile',
                    options: {
                        auth: {
                            strategy: 'firebase-mosahaya',
                            scope: ['business']
                        },
                        handler: Handler.profileEdit,
                        validate: Validate.profileEdit.input,
                        response: Validate.profileEdit.output,
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
                        handler: Handler.profileSelf,
                        description: STRING.PROFILE_GET_SELF,
                        response: Validate.profileSelf.output,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/user/profile',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.profileSearch,
                        description: STRING.PROFILE_SEARCH,
                        validate: Validate.profileSearch.input,
                        response: Validate.profileSearch.output,
                        tags: ['api', 'businessUser']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/user/profile/{id}',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.profileOne,
                        description: STRING.PROFILE_ONE,
                        validate: Validate.profileOne.input,
                        response: Validate.profileOne.output,
                        tags: ['api', 'businessUser']
                    }
                }
            ]);
            Logger.info('BusinessUserRoutes - Finish adding businessUser routes.');
        } catch (error) {
            Logger.error('Error in loading BusinessUserRoutes: ', error);
            throw error;
        }
    };
}

export default new Routes();
