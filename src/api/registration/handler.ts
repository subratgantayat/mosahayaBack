import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import KeyvalueConfig from '../../config/keyvalueConfig';
import Makeskillsector from '../../config/makeskillsector';
import Verifycountry from '../../config/verifycountry';
import EXTERNALIZED_STRING from '../../assets/string-constants';
const STRING = EXTERNALIZED_STRING.registration;

export default class Handler {

    public static async keyvalue(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        try {
            return KeyvalueConfig.keyvalue;
            // return Makeskillsector.getSector();
            //  return Makeskillsector.getSkill();
            // return Verifycountry.verifyCountry();
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    }

    public static async create(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        try {
            const modal: Model<any> = connection.model('registration');
            const payload: any = request.payload;
            payload.generalData.dob = new Date(payload.generalData.dob).setHours(0,0,0,0);
            const newModal: any = new modal(request.payload);
            const data: any = await newModal.save();
            if(!data){
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
    }

    public static async viewForm(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        try {
            const modal: Model<any> = connection.model('registration');
            const query: any = request.query;
            query.dob =  new Date(query.dob).setHours(0,0,0,0);
        /*    const schema = JSON
            const {error, value} = schema.validate(result);
            if (error) {
                Logger.error(`Invalid service detail response from provider: ${JSON.stringify(provider)} with error: ${error}`);
                Logger.error(`Provider response: ${JSON.stringify(result)}`);
                return false;
            }*/
            const data: any = await modal.findOne({_id: request.params.id, 'generalData.dob': query.dob}).exec();
            if(!data){
                return Boom.badData(STRING.INVALID_ID_DOB);
            }
            return {message: EXTERNALIZED_STRING.global.READ_SUCCESSFULLY, data};
        } catch (error) {
            if (error.name === 'CastError') {
                return Boom.badData(STRING.INVALID_ID_DOB);
            }
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    }
}
