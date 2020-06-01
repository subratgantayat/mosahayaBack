import * as Boom from '@hapi/boom';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import * as Randomize from 'randomatic';


export default class Controller {
    public static create = async (payload: any, retry: number): Promise<any> =>{
        try {
            if(retry <= 0) {
                const e = new Error(EXTERNALIZED_STRING.global.ERROR_IN_CRAETING);
                e.name = 'mosahaya';
                throw e;
            }
            const modal: Model<any> = connection.model('enrollment');
            const newModal: any = new modal(payload);
            newModal.enrollmentId =  Randomize('0', 16);
            const data: any = await newModal.save();
            if (!data) {
                const e = new Error(EXTERNALIZED_STRING.global.ERROR_IN_CRAETING);
                e.name = 'mosahaya';
                throw e;
            }
            return data;
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                return await Controller.create(payload, retry - 1);
            }
            Logger.error(`${error}`);
            if (error.name === 'mosahaya') {
                throw Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CRAETING);
            }
            if (error.name === 'ValidationError') {
                throw Boom.badData(error.message);
            }
            throw Boom.badImplementation(error);
        }
    };
}
