import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import * as RP from 'request-promise';
import Utils from '../../helper/utils';
const STRING = EXTERNALIZED_STRING.employee;
const CAPTCHA_SECRET_KEY = Utils.getEnvVariable('CAPTCHA_SECRET_KEY', true);

export default class Handler {

    public static search = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?secret=' + CAPTCHA_SECRET_KEY + '&response=' + request.query['g-recaptcha-response'] + '&remoteip=' + request.info.remoteAddress;
            try {
                let body: any = await RP(verificationURL);
                body = JSON.parse(body);
                if (!(body && body.success && body.action === 'employee_search' && body.score >= 0)) {
                    return Boom.badData(STRING.INVALID_CAPTCHA);
                }
            } catch (error) {
                Logger.error('google recaptcha error');
                Logger.error(`${error}`);
                return Boom.badData(STRING.INVALID_CAPTCHA);
            }
            const admin: boolean = request.auth.credentials && request.auth.credentials.scope && request.auth.credentials.scope.includes('admin');
            for(const prop of ['contactNo','city','district'])
            {
                if(request.query[prop] && !admin) {
                    return Boom.badData(STRING.INVALID_QUERY_PARAM +' '+ prop );
                }
            }
            const modal: Model<any> = connection.model('employee');
            const limit: number = parseInt(request.query.limit.toString(), 10);
            const skip: number = limit * parseInt(request.query.page.toString(), 10);
            const andOp: any[] = [];
            andOp.push({'skills.link': {$in: request.query.skills}});
            if (request.query.state) {
                const s: any = {};
                s.state = {$in: request.query.state};
                andOp.push(s);
            }
            let select = 'name state city district address skills';
            if(admin){
                select = select + ' contactNo';
                for (const prop of ['contactNo']) {
                    if (request.query[prop]) {
                        const s: any = {};
                        s[prop] = {$in: request.query[prop]};
                        andOp.push(s);
                    }
                }
                for (const prop of ['city','district']) {
                    if (request.query[prop]) {
                        const b: any[] = [];
                        for (const a of request.query[prop]) {
                            b.push(new RegExp(a, 'i'));
                        }
                        const s: any = {};
                        s[prop] = {$in: b};
                        andOp.push(s);
                    }
                }
            }
            console.log(JSON.stringify(andOp));
            const data: any = await modal.find({$and: andOp}).sort({'createdAt': -1}).skip(skip).limit(limit).select(select).exec();
            const count: number = await modal.find({$and: andOp}).count().exec();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_READING + ' employee data');
            }
            return {message: 'Employee ' + EXTERNALIZED_STRING.global.READ_SUCCESSFULLY, data, count};
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public static findlimit = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const verificationURL = 'https://www.google.com/recaptcha/api/siteverify?secret=' + CAPTCHA_SECRET_KEY + '&response=' + request.query['g-recaptcha-response'] + '&remoteip=' + request.info.remoteAddress;
            try {
                let body: any = await RP(verificationURL);
                body = JSON.parse(body);
                if (!(body && body.success && body.action === 'employee_download' && body.score >= 0)) {
                    return Boom.badData(STRING.INVALID_CAPTCHA);
                }
            } catch (error) {
                Logger.error('google recaptcha error');
                Logger.error(`${error}`);
                return Boom.badData(STRING.INVALID_CAPTCHA);
            }
            const modal: Model<any> = connection.model('employee');
            const limit: number = 1000;
            let select = 'name state city district address skills';
            if(request.auth.credentials && request.auth.credentials.scope && request.auth.credentials.scope.includes('admin')){
                select = select + ' contactNo';
            }
            const data: any = await modal.find({'skills.link': {$in: request.query.skills}}).sort({'createdAt': -1}).limit(limit).select(select).exec();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_READING + ' employee data');
            }
            return {message: 'Employee ' + EXTERNALIZED_STRING.global.READ_SUCCESSFULLY, data};
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}
