import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import Handler from './handler';
import Validate from './validate';
const STRING = EXTERNALIZED_STRING.skill;

export default class Routes {
    public static register =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('SkillRoutes - Start adding skill routes.');
            server.route([
                {
                    method: 'GET',
                    path: '/api/v1/skill',
                    options: {
                        auth: {
                            strategy: 'employertoken',
                            scope: ['employer']
                        },
                        handler: Handler.findall,
                        validate: Validate.findall,
                        description: STRING.FINDALL,
                        tags: ['api', 'skill']
                    }
                }
            ]);
            Logger.info('SkillRoutes - Finish adding skill routes.');
        } catch (error) {
            Logger.error(`Error in loading SkillRoutes: ${error}`);
            throw error;
        }
    };
}
