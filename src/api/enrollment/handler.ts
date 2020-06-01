import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';

import EXTERNALIZED_STRING from '../../assets/string-constants';
const STRING = EXTERNALIZED_STRING.registration;

export default class Handler {

    public static create = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const modal: Model<any> = connection.model('enrollment');
            const payload: any = request.payload;
            const newModal: any = new modal(request.payload);
            const data: any = await newModal.save();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CRAETING);
            }
            return {message: EXTERNALIZED_STRING.global.CREATED_SUCCESSFULLY, data};
        } catch (error) {
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public static viewForm = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> => {
        try {
            const modal: Model<any> = connection.model('enrollment');
            const data: any = await modal.findOne({_id: request.params.id}).exec();
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
