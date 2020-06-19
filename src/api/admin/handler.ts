import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import {sign} from 'jsonwebtoken';
import Logger from '../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../assets/string-constants';
import Utils from '../../helper/utils';
const STRING = EXTERNALIZED_STRING.admin;
const JWT_PRIVATE_KEY = Utils.getEnvVariable('JWT_PRIVATE_KEY', true);

export default class Handler {

    public static create = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const modal: Model<any> = connection.model('admin');
            const payload: any =  request.payload;
            payload.password = Utils.encrypt(payload.password);
            payload.password_changed_at = new Date();
            const newModal: any = new modal(payload);
            const data: any = await newModal.save();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CRAETING + ' sign up data');
            }
            const tokenData: any = {
                phoneNumber: data.phoneNumber,
                scope: [data.scope],
                id: data._id,
                password_changed_at: data.password_changed_at
            };
            return {message: 'Sign up data ' + EXTERNALIZED_STRING.global.CREATED_SUCCESSFULLY, token: sign(tokenData, JWT_PRIVATE_KEY),
                user: {
                    phoneNumber: data.phoneNumber,
                    name: data.name
                }};
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                return Boom.badData(STRING.PHONE_NUMBER_EXIST);
            }
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public static signin = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const modal: Model<any> = connection.model('admin');
            const payload: any =  request.payload;
            const data: any =  await modal.findOne({phoneNumber:payload.phoneNumber}).select('password name phoneNumber scope password_changed_at');
            if(!(data &&  Utils.comparePassword(payload.password, data.password))){
                return Boom.badData(STRING.INVALID_LOGIN);
            }
            const tokenData: any = {
                phoneNumber: data.phoneNumber,
                scope: [data.scope],
                id: data._id,
                password_changed_at: data.password_changed_at
            };
            return {message: STRING.SIGNIN_SUCCESSFULLY, token: sign(tokenData, JWT_PRIVATE_KEY),
                user: {
                    phoneNumber: data.phoneNumber,
                    name: data.name
                }};
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}
