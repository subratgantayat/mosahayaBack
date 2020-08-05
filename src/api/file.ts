import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../assets/string-constants';
import Logger from '../helper/logger';
import * as Boom from '@hapi/boom';
import Config from '../config/config';
const STRING: any = EXTERNALIZED_STRING.file;

class Routes {
    public register = async (server: Hapi.Server): Promise<any> =>{
        try {
            Logger.info('SeverFileRoutes - Start adding file route.');
            server.route([
                {
                    method: 'GET',
                    path: '/api/public/v1/appversion',
                    options: {
                        handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
                            try {
                             return Config.appVersion;
                            } catch (error) {
                                Logger.error('File appversion error: ', error);
                                return Boom.badImplementation(error);
                            }
                        },
                        description: STRING.APP_VERSION,
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
            Logger.info('SeverFileRoutes - Finish adding server file route.');
        } catch (error) {
            Logger.error('Error in loading server file route: ', error);
            throw error;
        }
    };
}

export default new Routes();
