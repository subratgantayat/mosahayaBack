import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../../assets/string-constants';
import Logger from '../../../helper/logger';
import Handler from './handler';
import Validate from './validate';
const STRING: any = EXTERNALIZED_STRING.business.project;

class Routes {
    public register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('ProjectRoutes - Start adding project routes.');
            server.route([
                {
                    method: 'POST',
                    path: '/api/v1/business/project',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.create,
                        validate: Validate.create.input,
                        response: Validate.create.output,
                        description: STRING.CREATE,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/project/self',
                    options: {
                        handler: Handler.findSelf,
                        validate: Validate.findSelf,
                        description: STRING.FIND_SELF,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/project/self/{id}',
                    options: {
                        handler: Handler.findOneSelf,
                        validate: Validate.findOneSelf,
                        description: STRING.FIND_ONE_SELF,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'PUT',
                    path: '/api/v1/business/project/{id}',
                    options: {
                        handler: Handler.edit,
                        validate: Validate.edit,
                        description: STRING.EDIT,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/project',
                    options: {
                        handler: Handler.find,
                        validate: Validate.find,
                        description: STRING.FIND,
                        tags: ['api', 'project']
                    }
                }
            ]);
            Logger.info('ProjectRoutes - Finish adding project routes.');
        } catch (error) {
            Logger.error('Error in loading ProjectRoutes: ', error);
            throw error;
        }
    };
}

export default new Routes();
