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
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.findSelf,
                        validate: Validate.findSelf.input,
                        response: Validate.findSelf.output,
                        description: STRING.FIND_SELF,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/project/self/{id}',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.findOneSelf,
                        validate: Validate.findOneSelf.input,
                        response: Validate.findOneSelf.output,
                        description: STRING.FIND_ONE_SELF,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'PUT',
                    path: '/api/v1/business/project/{id}',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.edit,
                        validate: Validate.edit.input,
                        response: Validate.edit.output,
                        description: STRING.EDIT,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/project',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.find,
                        validate: Validate.find.input,
                        response: Validate.find.output,
                        description: STRING.FIND,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/project/{id}',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.findOne,
                        validate: Validate.findOne.input,
                        response: Validate.findOne.output,
                        description: STRING.FIND_ONE,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'PUT',
                    path: '/api/v1/business/project/apply/{id}',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.applyProject,
                        validate: Validate.applyProject.input,
                        response: Validate.applyProject.output,
                        description: STRING.APPLY_PROJECT,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/business/project/apply',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.getApplyProject,
                        response: Validate.getApplyProject.output,
                        description: STRING.GET_APPLY_PROJECT,
                        tags: ['api', 'project']
                    }
                },
                {
                    method: 'PUT',
                    path: '/api/v1/business/project/status/{id}',
                    options: {
                        auth: {
                            strategy: 'businesstoken',
                            scope: ['business']
                        },
                        handler: Handler.changeStatus,
                        validate: Validate.changeStatus.input,
                        response: Validate.changeStatus.output,
                        description: STRING.CHANGE_STATUS,
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
