import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../assets/string-constants';
import Logger from '../helper/logger';
const STRING: any = EXTERNALIZED_STRING.health;

class Routes {
    public register = async (server: Hapi.Server): Promise<any> =>{
        try {
            Logger.info('SeverHealthRoutes - Start adding server health route.');
            server.route([
                {
                    method: 'GET',
                    path: '/health',
                    options: {
                        handler: (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
                            Logger.silly('***** Health check start *****');
                            Logger.silly(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.pathname + ' --> ' + 200 + ' OK');
                            Logger.silly('***** Health check end *****');
                            return 'OK';
                        },
                        description: STRING.HEALTH_CHECK,
                        tags: ['api', 'health']
                    }
                }
            ]);
            Logger.info('SeverHealthRoutes - Finish adding server health route.');
        } catch (error) {
            Logger.error('Error in loading server health route: ', error);
            throw error;
        }
    };
}

export default new Routes();
