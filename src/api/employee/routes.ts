import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import Handler from './handler';
import Validate from './validate';
import PublicHandler from '../../helper/publicHandler';
const STRING: any = EXTERNALIZED_STRING.employee;

export default class Routes {
    public static register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('EmployeeRoutes - Start adding employee routes.');
            server.route([
                {
                    method: 'GET',
                    path: '/api/v1/employee/search',
                    options: {
                        auth: {
                            strategy: 'employertoken',
                            scope: ['employer']
                        },
                        pre:[
                            { method: PublicHandler.validateCaptchaQuery, assign: 'captcha' }
                        ],
                        handler: Handler.search,
                        validate: Validate.search,
                        description: STRING.SEARCH,
                        tags: ['api', 'employee']
                    }
                },
                {
                    method: 'GET',
                    path: '/api/v1/employee/findlimit',
                    options: {
                        auth: {
                            strategy: 'employertoken',
                            scope: ['employer']
                        },
                        pre:[
                            { method: PublicHandler.validateCaptchaQuery, assign: 'captcha' }
                        ],
                        handler: Handler.findlimit,
                        validate: Validate.findlimit,
                        description: STRING.FIND_LIMIT,
                        tags: ['api', 'employee']
                    }
                }
            ]);
            Logger.info('EmployeeRoutes - Finish adding employee routes.');
        } catch (error) {
            Logger.error(`Error in loading EmployeeRoutes: ${error}`);
            throw error;
        }
    };
}
