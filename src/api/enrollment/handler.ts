import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import Controller from './controller';
import * as RP from 'request-promise';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Utils from '../../helper/utils';
const STRING = EXTERNALIZED_STRING.enrollment;
const CAPTCHA_SECRET_KEY = Utils.getEnvVariable('CAPTCHA_SECRET_KEY', true);


export default class Handler {

    public static create = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            // @ts-ignore
            Logger.debug(`User location: ${request.location}`);
            const payload: any = request.payload;
            const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?secret=' + CAPTCHA_SECRET_KEY + '&response=' + payload['g-recaptcha-response'] + '&remoteip=' + request.info.remoteAddress;
            try {
                let body: any = await RP(verificationURL);
                body = JSON.parse(body);
                if (!(body && body.success)) {
                    return Boom.badData(STRING.INVALID_CAPTCHA);
                }
            } catch (error) {
                Logger.error('google recaptcha error');
                Logger.error(`${error}`);
                return Boom.badData(STRING.INVALID_CAPTCHA);
            }
            const data: any = await Controller.create(payload, 7);
            return {message: 'Enrollment ' + EXTERNALIZED_STRING.global.CREATED_SUCCESSFULLY, data};
        } catch (error) {
            Logger.error(`${error}`);
            return error;
        }
    };

    public static viewForm = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            // @ts-ignore
            Logger.debug('User location', request.location);
            const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?secret=' + CAPTCHA_SECRET_KEY + '&response=' + request.params.grecaptcharesponse + '&remoteip=' + request.info.remoteAddress;
            try {
                let body: any = await RP(verificationURL);
                body = JSON.parse(body);
                if (!(body && body.success)) {
                    return Boom.badData(STRING.INVALID_CAPTCHA);
                }
            } catch (error) {
                Logger.error('google recaptcha error');
                Logger.error(`${error}`);
                return Boom.badData(STRING.INVALID_CAPTCHA);
            }
            const modal: Model<any> = connection.model('enrollment');
            const data: any = await modal.findOne({enrollmentId: request.params.id}).exec();
            if (!data) {
                return Boom.badData(STRING.INVALID_ID);
            }
            return {message: 'Enrollment ' + EXTERNALIZED_STRING.global.READ_SUCCESSFULLY, data};
        } catch (error) {
            if (error.name === 'CastError') {
                return Boom.badData(STRING.INVALID_ID);
            }
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}
