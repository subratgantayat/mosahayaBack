import * as Hapi from '@hapi/hapi';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Logger from '../../helper/logger';
import Handler from './handler';
import Validate from './validate';
import PublicHandler from '../../helper/publicHandler';
const STRING: any = EXTERNALIZED_STRING.skill;

class Routes {
    public register =  async (server: Hapi.Server): Promise<any> => {
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
                        app:{
                            captchaAction: 'skill_findall',
                            captchaScore: 0,
                            captchaIn: 'query'
                        },
                        pre:[
                            { method: PublicHandler.validateCaptchaInput, assign: 'captcha' }
                        ],
                        handler: Handler.findall,
                        validate: Validate.findall,
                        description: STRING.FINDALL,
                        tags: ['api', 'skill']
                    }
                }
            ]);
            Logger.info('SkillRoutes - Finish adding skill routes.');
        } catch (error) {
            Logger.error('Error in loading SkillRoutes: ', error);
            throw error;
        }
    };
}

export default new Routes();

