import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../assets/string-constants';
import Logger from '../helper/logger';
import * as Boom from '@hapi/boom';
import Config from '../config/config';
import KeyvalueConfig from '../config/keyvalueConfig';
import BusinessKeyValue from '../config/businessKeyValue';

const STRING: any = EXTERNALIZED_STRING.public;

class Routes {
    public register = async (server: Hapi.Server): Promise<any> =>{
        try {
            Logger.info('PublicRoutes - Start adding public route.');
            server.route([
                {
                    method: 'GET',
                    path: '/api/public/v1/appversion',
                    options: {
                        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
                            try {
                             return Config.appVersion;
                            } catch (error) {
                                Logger.error('Public appversion error: ', error);
                                return Boom.badImplementation(error);
                            }
                        },
                        description: STRING.APP_VERSION,
                        tags: ['api', 'public']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/keyvalue',
                    options: {
                        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
                            try {
                                return {
                                    ...KeyvalueConfig.keyvalue, ...BusinessKeyValue.keyvalue
                                };
                            } catch (error) {
                                Logger.error('Public keyvalue error: ', error);
                                return Boom.badImplementation(error);
                            }
                        },
                        description: STRING.KEY_VALUE,
                        tags: ['api', 'public']
                    }
                },
                {
                    method: 'GET',
                    path: '/public/{param*}',
                    options: {
                        handler: {
                            directory: {
                                path: '.',
                                redirectToSlash: true
                            }
                        },
                        description: STRING.FILE,
                        tags: ['api', 'public']
                    }
                }
            ]);
            Logger.info('PublicRoutes - Finish adding public route.');
        } catch (error) {
            Logger.error('Error in loading public route: ', error);
            throw error;
        }
    };
}

export default new Routes();
