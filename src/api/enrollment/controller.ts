import * as Boom from '@hapi/boom';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import * as Randomize from 'randomatic';

class Controller {
    public create = async (payload: any, retry: number): Promise<any> =>{
        try {
            if(retry <= 0) {
                const e = new Error(EXTERNALIZED_STRING.global.ERROR_IN_CREATING);
                e.name = 'mosahaya';
                throw e;
            }
            const modal: Model<any> = connection.model('enrollment');
            const newModal: any = new modal(payload);
            newModal.enrollmentId =  Randomize('0', 16);
            newModal.experienceInMonth = 0;
            if(payload.experience){
                if(payload.experience.expYear) {
                    newModal.experienceInMonth = 12*payload.experience.expYear;
                }
                if(payload.experience.expMonth){
                    newModal.experienceInMonth = newModal.experienceInMonth + payload.experience.expMonth;
                }
            }
            const data: any = await newModal.save();
            if (!data) {
                const e = new Error(EXTERNALIZED_STRING.global.ERROR_IN_CREATING);
                e.name = 'mosahaya';
                throw e;
            }
            return data;
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                return await this.create(payload, retry - 1);
            }
            Logger.error(`Error: `, error);
            if (error.name === 'mosahaya') {
                throw Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CREATING + ' enrollment data');
            }
            if (error.name === 'ValidationError') {
                throw Boom.badData(error.message);
            }
            throw Boom.badImplementation(error);
        }
    };
}

export default new Controller();
