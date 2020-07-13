import * as Hapi from '@hapi/hapi';
import Logger from './logger';
import * as RP from 'request-promise';
import * as Boom from '@hapi/boom';
import Utils from './utils';
import EXTERNALIZED_STRING from '../assets/string-constants';
const CAPTCHA_SECRET_KEY: string = Utils.getEnvVariable('CAPTCHA_SECRET_KEY', true);
const captchaUrl: string = 'https://www.google.com/recaptcha/api/siteverify?secret=' + CAPTCHA_SECRET_KEY;

const validateCaptcha = async (captcha: string, remoteAddress: string): Promise<any> =>{
    const verificationURL = captchaUrl + '&response=' + captcha + '&remoteip=' + remoteAddress;
    try {
        let body: any = await RP(verificationURL);
        body = JSON.parse(body);
        if (!(body && body.success)) {
            return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
        }
        return body;
    } catch (error) {
        Logger.error('google recaptcha error');
        Logger.error(`${error}`);
        return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
    }
};
export default class PublicHandler {

    public static validateCaptchaPayload = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        return await validateCaptcha(request.payload['g-recaptcha-response'], request.info.remoteAddress);
    };

    public static validateCaptchaQuery = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        return await validateCaptcha(request.query['g-recaptcha-response'].toString(), request.info.remoteAddress);
    };

}
