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
    private validateCaptcha = async (captcha: string, remoteAddress: string): Promise<any> =>{
        try {
            const verificationURL = captchaUrl + '&response=' + captcha + '&remoteip=' + remoteAddress;
            if (NODE_ENV === 'development') {
                return {
                    action:'demo',
                    score: 0.9
                };
            }
            let body: any = await RP(verificationURL);
            body = JSON.parse(body);
            if (!(body && body.success)) {
                return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
            }
            return body;
        } catch (error) {
            Logger.error('google recaptcha error');
            Logger.error(`Error: `, error);
            return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
        }
    };
    public validateCaptchaPayload = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        return await this.validateCaptcha(request.payload['g-recaptcha-response'], request.info.remoteAddress);
    };

    public validateCaptchaQuery = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        return await this.validateCaptcha(request.query['g-recaptcha-response'].toString(), request.info.remoteAddress);
    };

}

export default new PublicHandler();
