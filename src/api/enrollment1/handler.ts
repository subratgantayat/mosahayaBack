import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import Controller from './controller';
import EXTERNALIZED_STRING from '../../assets/string-constants';
const STRING = EXTERNALIZED_STRING.enrollment1;

class Handler {
    private enrollmentFields: string[] = ['generalData.registerBy', 'generalData.name', 'generalData.gender', 'generalData.age','generalData.pinCode','generalData.address','skillData.sectors','skillData.sectorsOther','skillData.skills','skillData.skillsOther','skillData.experience','skillData.education','skillData.preferredLocations','skillData.otherInfo','healthData.currentCondition','healthData.currentConditionOther','healthData.symptoms','healthData.symptomsOther'];

    public create = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const payload: any = request.payload;
            const data: any = await Controller.create(payload, 7);
            return {message: STRING.success.CREATE_SUCCESS, enrolment:data.toObject()};
        } catch (error) {
            Logger.error(`Error: `, error);
            return error;
        }
    };

    public viewForm = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const modal: Model<any> = connection.model('enrollment1');
            const data: any = await modal.findOne({enrollmentId: request.params.id}).select('+enrollmentId +generalData.mobileNumber').lean(true).exec();
            if (!data) {
                return Boom.badData(STRING.error.INVALID_ID);
            }
            return {
                message: STRING.success.READ_SUCCESSFUL,
                enrollment: data
            };
        } catch (error) {
         /*   if (error.name === 'CastError') {
                return Boom.badData(STRING.error.INVALID_ID);
            }*/
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public find = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const credentials: any = request.auth.credentials;
            const andOp: any[] = [
                {'skillData.sectors': {$in: request.query.sectors}},
                {'skillData.skills': {$in: request.query.skills}},
                {'skillData.preferredLocations': {$in: request.query.preferredLocations}}
            ];
            for (const prop of ['skillData.sectorsOther' ,'skillData.skillsOther']) {
                const p: string = prop.split('.')[1] || prop;
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
            const admin: boolean = credentials.scope && credentials.scope.includes('admin');
            const select: any = {};
            for (const item of this.enrollmentFields) {
                select[item] = 1;
            }
            if (admin) {
                select['generalData.mobileNumber'] = 1;
            }
            const sortOrder:number = request.query.sortOrder === 'asc' ? 1 :-1;
            const sort: any = {};
            if(request.query.sort === 'name'){
                sort['generalData.name'] = sortOrder;
            }else if(request.query.sort === 'age'){
                sort['generalData.age'] = sortOrder;
            }  else{
                sort[request.query.sort.toString()] = sortOrder;
            }
            const limit: number = parseInt(request.query.limit.toString(), 10);
            const skip: number = limit * parseInt(request.query.page.toString(), 10);
            const modal: Model<any> = connection.model('enrollment1');
            const data: any[] = await modal.find({$and: andOp}).sort(sort).skip(skip).limit(limit).select(select).populate('userId', 'name').lean(true).exec();
            const count: number = await modal.find({$and: andOp}).countDocuments().exec();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_READING);
            }
            return {
                message: STRING.success.SEARCH_SUCCESSFUL,
                enrollments: data,
                count
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public findOne = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const credentials: any = request.auth.credentials;
            const admin: boolean = credentials.scope && credentials.scope.includes('admin');
            const select: any = {};
            for (const item of this.enrollmentFields) {
                select[item] = 1;
            }
            if (admin) {
                select['generalData.mobileNumber'] = 1;
            }
            const {id}: any = request.params;
            const modal: Model<any> = connection.model('enrollment1');
            const data: any = await modal.findById(id).select(select).lean(true).exec();
            if (!data) {
                return Boom.badData(STRING.error.INVALID_ENROLLMENT);
            }
            return {
                message: STRING.success.READ_SUCCESSFUL,
                enrollment: data
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };
}

export default new Handler();
