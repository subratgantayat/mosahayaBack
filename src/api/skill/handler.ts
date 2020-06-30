import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import * as RP from 'request-promise';
import Utils from '../../helper/utils';
const STRING = EXTERNALIZED_STRING.skill;
const CAPTCHA_SECRET_KEY = Utils.getEnvVariable('CAPTCHA_SECRET_KEY', true);

export default class Handler {

    public static findall = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?secret=' + CAPTCHA_SECRET_KEY + '&response=' + request.query['g-recaptcha-response'] + '&remoteip=' + request.info.remoteAddress;
            try {
                let body: any = await RP(verificationURL);
                body = JSON.parse(body);
                console.log(body);
                if (!(body && body.success && body.action === 'skill_findall' && body.score >= 0)) {
                    return Boom.badData(STRING.INVALID_CAPTCHA);
                }
            } catch (error) {
                Logger.error('google recaptcha error');
                Logger.error(`${error}`);
                return Boom.badData(STRING.INVALID_CAPTCHA);
            }
            const modal: Model<any> = connection.model('skill');
            const data: any[] = await modal.find().select('name');
            return {message: 'Skill ' + EXTERNALIZED_STRING.global.READ_SUCCESSFULLY, data};
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}
