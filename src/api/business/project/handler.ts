import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../../helper/logger';
import {connection, Model, Types} from 'mongoose';
import EXTERNALIZED_STRING from '../../../assets/string-constants';
import Config from '../../../config/config';

const STRING: any = EXTERNALIZED_STRING.business.project;

class Handler {
    private projectFields: string[] = ['active', 'userId', 'title', 'description', 'typeOfEmployer', 'natureOfProject', 'location', 'sectors', 'requirements', 'natureOfEmployment', 'facility'];

    private fillCalculated = (payload: any): void => {
        payload.maxSalaryCalculated = 0;
        payload.noOfEmployeesCalculated = 0;
        for (const requirement of payload.requirements) {
            for (const detail of requirement.details) {
                payload.noOfEmployeesCalculated = payload.noOfEmployeesCalculated + detail.noOfPeople;
                if (detail.salaryPerMonth.maxValue > payload.maxSalaryCalculated) {
                    payload.maxSalaryCalculated = detail.salaryPerMonth.maxValue;
                }
            }
        }
    };

    public create = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const payload: any = request.payload;
            const credentials: any = request.auth.credentials;
            payload.userId = credentials.id;
            this.fillCalculated(payload);
            const modal: Model<any> = connection.model('project');
            const newModal: any = new modal(payload);
            const data: any = await newModal.save();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CREATING);
            }
            return {
                message: STRING.success.PROJECT_CREATE_SUCCESSFUL,
                project: data.toObject()
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            if (error.name === 'MongoError' && error.code === 11000) {
                return Boom.badData(STRING.error.TITLE_ALREADY_TAKEN);
            }
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            return Boom.badImplementation(error);
        }
    };

    public findSelf = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const credentials: any = request.auth.credentials;
            const andOp: any[] = [
                {userId: credentials.id}
            ];
            if (request.query.title) {
                andOp.push({title: new RegExp(request.query.title.toString(), 'i')});
                // andOp.push({$text:  { $search : request.query.title}});
                //  sort.score = { $meta : 'textScore' };
            }
            if (request.query.active !== 'all') {
                andOp.push({active: (request.query.active === 'y')});
            }
            if (request.query.loctaion) {
                andOp.push({location: {$in: request.query.loctaion}});
            }
            const sort: any = {};
            sort[request.query.sort.toString()] = request.query.sortOrder === 'asc' ? 1 : -1;
            const limit: number = parseInt(request.query.limit.toString(), 10);
            const skip: number = limit * parseInt(request.query.page.toString(), 10);
            const modal: Model<any> = connection.model('project');
            const data: any[] = await modal.find({$and: andOp}).sort(sort).skip(skip).limit(limit).select('+contactDetails +applications').populate('applications.user', 'name active').lean(true).exec();
            const count: number = await modal.find({$and: andOp}).countDocuments().exec();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_READING);
            }
            return {
                message: STRING.success.PROJECT_SEARCH_SUCCESSFUL,
                projects: data,
                count
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public findOneSelf = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const credentials: any = request.auth.credentials;
            const {id}: any = request.params;
            const modal: Model<any> = connection.model('project');
            // const modalBusinessUser: Model<any> = connection.model('businessuser');
            const data: any = await modal.findOne({
                _id: id,
                userId: credentials.id
            }).select('+contactDetails +applications').populate('applications.user', 'name active').lean(true).exec();
            if (!data) {
                return Boom.badData(STRING.error.INVALID_PROJECT);
            }
            return {
                message: STRING.success.PROJECT_READ_SUCCESSFUL,
                project: data
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public edit = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const payload: any = request.payload;
            const {id}: any = request.params;
            const credentials: any = request.auth.credentials;
            this.fillCalculated(payload);
            const modal: Model<any> = connection.model('project');
            const data: any = await modal.findOneAndUpdate({
                userId: credentials.id,
                _id: id
            }, {$set: payload}, {new: true, fields: '+contactDetails'}).exec();
            if (!data) {
                return Boom.badData(STRING.error.INVALID_PROJECT);
            }
            return {
                message: STRING.success.PROJECT_EDIT_SUCCESSFUL,
                project: data.toObject()
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            if (error.name === 'MongoError' && error.code === 11000) {
                return Boom.badData(STRING.error.TITLE_ALREADY_TAKEN);
            }
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            return Boom.badImplementation(error);
        }
    };

    public find = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const credentials: any = request.auth.credentials;
            const andOp: any[] = [
                {userId: {$ne: credentials.id}},
                {active: true},
                {'sectors': {$in: request.query.sectors}},
                {'location': {$in: request.query.location}}
            ];
            if (request.query.skill) {
                andOp.push({'requirements.skill': {$in: request.query.skill}});
            }
            if (request.query.employmentType) {
                andOp.push({'natureOfEmployment.employmentType': {$in: request.query.employmentType}});
            }
            if (request.query.sectorsOther) {
                andOp.push({'sectorsOther': {$in: request.query.sectorsOther}});
            }

            if (request.query.skillOther) {
                andOp.push({'requirements.skillOther': {$in: request.query.skillOther}});
            }

            if (request.query.expectedSalary) {
                andOp.push({'maxSalaryCalculated': {$gte: request.query.expectedSalary}});
            }
            for (const prop of ['accommodation', 'transport', 'canteen', 'cookingArea', 'medicalCheckup', 'healthInsurance', 'industrialSafetyGears', 'quarantineFacility', 'guaranteedMinPay', 'overTime']) {
                if (request.query[prop]) {
                    const s: any = {};
                    s[prop] = request.query[prop];
                    andOp.push(s);
                }
            }
            const admin: boolean = credentials.scope && credentials.scope.includes('admin');
            const select: any = {};
            for (const item of this.projectFields) {
                select[item] = 1;
            }
            if (admin) {
                select.contactDetails = 1;
            }
            const sort: any = {};
            sort[request.query.sort.toString()] = request.query.sortOrder === 'asc' ? 1 : -1;
            const limit: number = parseInt(request.query.limit.toString(), 10);
            const skip: number = limit * parseInt(request.query.page.toString(), 10);
            const modal: Model<any> = connection.model('project');
            // const modalBusinessUser: Model<any> = connection.model('businessuser');
            const data: any[] = await modal.find({$and: andOp}).sort(sort).skip(skip).limit(limit).select(select).populate('userId', 'name').lean(true).exec();
            const count: number = await modal.find({$and: andOp}).countDocuments().exec();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_READING);
            }
            return {
                message: STRING.success.PROJECT_SEARCH_SUCCESSFUL,
                projects: data,
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
            const select: any = {applications: 1};
            for (const item of this.projectFields) {
                select[item] = 1;
            }
            if (admin) {
                select.contactDetails = 1;
            }
            const {id}: any = request.params;
            const modal: Model<any> = connection.model('project');
            //  const modalBusinessUser: Model<any> = connection.model('businessuser');
            const data: any = await modal.findOne({
                _id: id,
                active: true
            }).select(select).populate('userId', 'name').lean(true).exec();
            if (!data) {
                return Boom.badData(STRING.error.INVALID_PROJECT);
            }
            let applied: any;
            if (data.applications) {
                applied = data.applications.filter((v) => JSON.stringify(v.user) === JSON.stringify(credentials.id));
                if(applied.length> 0 ){
                    data.applications = applied[0];
                }
            }
            return {
                message: STRING.success.PROJECT_READ_SUCCESSFUL,
                project: data
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public applyProject = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const {id}: any = request.params;
            const modal: Model<any> = connection.model('project');
            const credentials: any = request.auth.credentials;
            const record: any = {
                user: credentials.id,
                status: Config.defaultProjectApplicationStatus,
                appliedOn: new Date()
            };
            const data: any = await modal.findOneAndUpdate({
                _id: id,
                active: true,
                userId: {$ne: credentials.id},
                'applications.user': {$ne: credentials.id}
                // @ts-ignore
            }, {$push: {applications: record}}, {new: true, fields: '_id', rawResult: true}).exec();
            if (!(data && data.value)) {
                return Boom.badData(STRING.error.INVALID_PROJECT_TO_APPLY);
            }
            return {
                message: STRING.success.PROJECT_APPLY_SUCCESSFUL
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            return Boom.badImplementation(error);
        }
    };

    public getApplyProject = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const credentials: any = request.auth.credentials;
            const modal: Model<any> = connection.model('project');
            const admin: boolean = credentials.scope && credentials.scope.includes('admin');
            const select: any = {};
            for (const item of this.projectFields) {
                select[item] = 1;
            }
            if (admin) {
                select.contactDetails = 1;
            }
            delete select.userId;
            select['userId._id'] = 1;
            select['userId.name'] = 1;
            select['userId.active'] = 1;
            select.applications = 1;
            const data: any[] = await modal.aggregate(
                [
                    {
                        $match: {
                            active: true,
                            'applications.user': Types.ObjectId(credentials.id)
                        }
                    },
                    {$unwind: '$applications'},
                    {
                        $match: {
                            'applications.user': Types.ObjectId(credentials.id)
                        }
                    },
                    {
                        $sort: {
                            'applications.appliedOn': -1
                        }
                    },
                    {
                        $lookup:
                            {
                                from: 'businessusers',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'userId'
                            }
                    },
                    {$unwind: '$userId'},
                    {
                        '$project': select
                    }
                ]
            ).exec();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_READING);
            }
            return {
                message: STRING.success.PROJECT_READ_SUCCESSFUL,
                projects: data
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            return Boom.badImplementation(error);
        }
    };

    public changeStatus = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const {id}: any = request.params;
            const payload: any = request.payload;
            const modal: Model<any> = connection.model('project');
            const credentials: any = request.auth.credentials;
            const record: any = {
                user: credentials.id,
                status: Config.defaultProjectApplicationStatus,
                appliedOn: new Date()
            };
            const data: any = await modal.findOneAndUpdate({
                _id: id,
                userId: credentials.id,
                active: true,
                'applications.user': payload.userId
            },{ $set: { 'applications.$[element].status' : payload.status } },
              {arrayFilters: [ { 'element.user': payload.userId } ],new: true, fields: '_id', rawResult: true}).exec();
            if (!(data && data.value)) {
                return Boom.badData(STRING.error.INVALID_PROJECT_TO_APPLY);
            }
            return {
                message: STRING.success.STATUS_CHANGE_SUCCESSFUL
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            return Boom.badImplementation(error);
        }
    };
}

export default new Handler();
