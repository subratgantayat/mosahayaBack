import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../assets/string-constants';
import Logger from '../helper/logger';
const STRING = EXTERNALIZED_STRING.file;

export default class Routes {
    public static register = async (server: Hapi.Server): Promise<any> =>{
        try {
            Logger.info('SeverFileRoutes - Start adding file route.');
            server.route([
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
                        tags: ['api', 'file']
                    }
                }
            ]);
            Logger.info('SeverFileRoutes - Finish adding server file route.');
        } catch (error) {
            Logger.error(`Error in loading server file route: ${error}`);
            throw error;
        }
    };
}
