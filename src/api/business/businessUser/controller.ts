import EXTERNALIZED_STRING from '../../../assets/string-constants';
import {connection, Model} from 'mongoose';
import Logger from '../../../helper/logger';
import * as Boom from '@hapi/boom';
const STRING: any = EXTERNALIZED_STRING.business.businessUser;

class Controller {
    public create = async (payload: any): Promise<any> =>{
        try {
            payload.name = payload.name.toLowerCase();
            payload.email = payload.email.toLowerCase();
            const modal: Model<any> = connection.model('businessuser');
            payload.password_changed_at = new Date();
            payload.emailVerified = true;
            const newModal: any = new modal(payload);
            const data: any = await newModal.save();
            if (!data) {
                return Promise.reject(Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CREATING));
            }
            return data;
        } catch (error) {
            Logger.error(`Error: `, error);
            if (error.name === 'MongoError' && error.code === 11000) {
                return Promise.reject(Boom.badData(STRING.error.EMAIL_ALREADY_TAKEN));
            }
            if (error.name === 'ValidationError') {
                return Promise.reject(Boom.badData(error.message));
            }
            return Promise.reject(Boom.badImplementation(error));
        }
    };
}

export default new Controller();
