import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import Handler from './handler';
import Validate from './validate';
const STRING = EXTERNALIZED_STRING.registration;

export default class Routes {
    public static async register(server: Hapi.Server): Promise<any> {
        try {
            Logger.info('RegistrationRoutes - Start adding registration routes.');
            server.route([
                {
                    method: 'GET',
                    path: '/api/v1/registration/keyvalue',
                    options: {
                        handler: Handler.keyvalue,
                        description: STRING.KEYVALUE,
                        tags: ['api', 'registration']
                    }
                },
                {
                    method: 'POST',
                    path: '/api/v1/registration',
                    options: {
                        handler: Handler.create,
                        validate: Validate.create,
                        description: STRING.CREATE,
                        tags: ['api', 'registration']
                      //  response: Validate.findResponse
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/registration/{id}',
                    options: {
                        handler: Handler.viewForm,
                        validate: Validate.viewForm,
                        description: STRING.VIEW_FORM,
                        tags: ['api', 'registration']
                        //  response: Validate.findResponse
                    }
                }
            ]);
            Logger.info('RegistrationRoutes - Finish adding extension routes.');
        } catch (error) {
            Logger.error(`Error in loading RegistrationRoutes: ${error}`);
            throw error;
        }
    }
}
