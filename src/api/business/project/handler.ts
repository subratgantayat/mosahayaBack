import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../../assets/string-constants';

const STRING: any = EXTERNALIZED_STRING.business.project;

class Handler {
    public create = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const payload: any = request.payload;
            const credentials: any = request.auth.credentials;
            payload.userId = credentials.id;
            payload.maxSalaryCalculated = 0;
            payload.noOfEmployeesCalculated=0;
            for (const requirement of payload.requirements) {
                for (const detail of requirement.details) {
                    payload.noOfEmployeesCalculated = payload.noOfEmployeesCalculated + detail.noOfPeople;
                    if (detail.salaryPerMonth.maxValue > payload.maxSalaryCalculated) {
                        payload.maxSalaryCalculated = detail.salaryPerMonth.maxValue;
                    }
                }
            }
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
            return 'ok';
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public findOneSelf = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            return 'ok';
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public edit = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            return 'ok';
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public find = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            return 'ok';
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };
}

export default new Handler();
