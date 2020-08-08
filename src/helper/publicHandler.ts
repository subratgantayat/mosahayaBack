import * as Hapi from '@hapi/hapi';
import Logger from './logger';
import * as RP from 'request-promise';
import * as Boom from '@hapi/boom';
import Utils from './utils';
import EXTERNALIZED_STRING from '../assets/string-constants';
const NODE_ENV: string = Utils.getEnvVariable('NODE_ENV', true);
const CAPTCHA_SECRET_KEY: string = Utils.getEnvVariable('CAPTCHA_SECRET_KEY', true);
const captchaUrl: string = 'https://www.google.com/recaptcha/api/siteverify?secret=' + CAPTCHA_SECRET_KEY;

class PublicHandler {
    public validateCaptchaInput: any = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            if (NODE_ENV === 'development') {
                return {
                    action:'demo',
                    score: 0.9
                };
            }
            const {captchaIn, captchaAction, captchaScore}: any = request.route.settings.app;
            const verificationURL = captchaUrl + '&response=' + request[captchaIn]['g-recaptcha-response'].toString() + '&remoteip=' + request.info.remoteAddress;
            let body: any = await RP(verificationURL);
            body = JSON.parse(body);
            if (!(body && body.success && body.action === captchaAction && body.score >= captchaScore)) {
                return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
            }
            return body;
        } catch (error) {
            Logger.error('google recaptcha error', error);
            return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
        }
    };

}

export default new PublicHandler();
