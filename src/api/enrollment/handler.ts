import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import Controller from './controller';
import EXTERNALIZED_STRING from '../../assets/string-constants';
const STRING = EXTERNALIZED_STRING.enrollment;

export default class Handler {

    public static create = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const payload: any = request.payload;
            const data: any = await Controller.create(payload, 7);
            return {message: EXTERNALIZED_STRING.global.CREATED_SUCCESSFULLY, data};
        } catch (error) {
            Logger.error(`${error}`);
            return error;
        }
    };

    public static viewForm = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            console.log('aa');
            const modal: Model<any> = connection.model('enrollment');
            const data: any = await modal.findOne({enrollmentId: request.params.id}).exec();
            if (!data) {
                return Boom.badData(STRING.INVALID_ID);
            }
            return {message: EXTERNALIZED_STRING.global.READ_SUCCESSFULLY, data};
        } catch (error) {
            if (error.name === 'CastError') {
                return Boom.badData(STRING.INVALID_ID);
            }
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}
