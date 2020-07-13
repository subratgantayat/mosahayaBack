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
            const captchaResponse: any = request.pre.captcha;
            if (!(captchaResponse.action === 'register' && captchaResponse.score >= 0.4)) {
                return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
            }
            const payload: any = request.payload;
            const data: any = await Controller.create(payload, 7);
            return {message: 'Enrollment ' + EXTERNALIZED_STRING.global.CREATED_SUCCESSFULLY, data};
        } catch (error) {
            Logger.error(`${error}`);
            return error;
        }
    };

    public static viewForm = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const captchaResponse: any = request.pre.captcha;
            if (!(captchaResponse.action === 'register' && captchaResponse.score >= 0.4)) {
                return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
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

    public static findall = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
           /* const captchaResponse: any = request.pre.captcha;
            if (!(captchaResponse.action === 'enrollment_search' && captchaResponse.score >= 0)) {
                return Boom.badData(EXTERNALIZED_STRING.global.INVALID_CAPTCHA);
            }*/
            if (request.query.expFrom && request.query.expTo && (request.query.expFrom > request.query.expTo)) {
                return Boom.badData('Experience from can not be more than experience to');
            }
            if (request.query.ageFrom && request.query.ageTo && (request.query.ageFrom > request.query.ageTo)) {
                return Boom.badData('Age from can not be more than age to');
            }

            if (request.query.createdAtFrom && request.query.createdAtTo && (new Date(request.query.createdAtFrom.toString()).getTime() > new Date(request.query.createdAtTo.toString()).getTime())) {
                return Boom.badData('Created at from can not be more than Created at to');
            }
            const modal: Model<any> = connection.model('enrollment');
            const limit: number = parseInt(request.query.limit.toString(), 10);
            const skip: number = limit * parseInt(request.query.page.toString(), 10);
            const andOp: any[] = [];
            andOp.push({'skillData.skills': {$in: request.query.skills}});
            // const search: any ={'skillData.skills':{$in: request.query.skills}};
            /*       if(request.query.skillsOther){
                       const b: any[] =[];
                       for(const a of request.query.skillsOther)
                       {
                           b.push({ $regex: `/${a}/i`, $options: 'i'});
                       }
                       search['skillData.skillsOther'] = {$or:b};
                   }*/
            for (const prop of ['skillData.sectors', 'skillData.preferredLocations', 'skillData.education', 'generalData.registerBy', 'generalData.mobileNumber', 'enrollmentID', 'generalData.gender', 'generalData.pinCode']) {
                const p: string = prop.split('.')[1];
                if (request.query[p || prop]) {
                    const s: any = {};
                    s[prop] = {$in: request.query[p || prop]};
                    andOp.push(s);
                }
            }
            for (const prop of ['skillData.skillsOther', 'skillData.sectorsOther', 'skillData.preferredLocationsOther', 'generalData.name']) {
                const p: string = prop.split('.')[1];
                if (request.query[p]) {
                    const b: any[] = [];
                    for (const a of request.query[p]) {
                        b.push(new RegExp(a, 'i'));
                    }
                    const s: any = {};
                    s[prop] = {$in: b};
                    andOp.push(s);
                }
            }

            if (request.query.ageFrom) {
                andOp.push({age: {$gte: request.query.ageFrom}});
            }
            if (request.query.ageTo) {
                andOp.push({age: {$lte: request.query.ageTo}});
            }

            if (request.query.createdAtFrom) {
                andOp.push({createdAt: {$gte: new Date(request.query.createdAtFrom.toString())}});
            }
            if (request.query.createdAtTo) {
                andOp.push({createdAt: {$lte: new Date(request.query.createdAtTo.toString())}});
            }
            if (request.query.currentCondition) {
                andOp.push({$or: [{currentCondition: {$exists: true}}, {currentConditionOther: {$exists: true}}]});
            }
            if (request.query.symptoms) {
                andOp.push({$or: [{symptoms: {$exists: true}}, {symptomsOther: {$exists: true}}]});
            }

            /*function hex_md5(a): number {
                return (a.expYear ? a.expYear * 12 : 0) + (a.expMonth ? a.expMonth : 0);
            }

            andOp.push({
                $where() {
                    return (hex_md5(this['generalData.experience']) >= 6);
                }
            });*/
            let select: string = 'enrollmentId generalData.name generalData.pinCode skillData.skills skillData.preferredLocations';
            // @ts-ignore
            if(request.verified){
                select = select + ' generalData.mobileNumber';
            }
            const data: any = await modal.find({$and: andOp}).sort({'createdAt': -1}).skip(skip).limit(limit).select(select).exec();
            const count: number = await modal.find({$and: andOp}).count().exec();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_READING + ' enrollment data');
            }
            return {message: 'Enrollment ' + EXTERNALIZED_STRING.global.READ_SUCCESSFULLY, data, count};
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}
