import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../../assets/string-constants';
const STRING: any = EXTERNALIZED_STRING.business.project;

class Handler {
    public create = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
           return 'ok';
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public findSelf = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            return 'ok';
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public findOneSelf = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            return 'ok';
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public edit = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            return 'ok';
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };

    public find = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            console.log(request.query.filter);
            return 'ok';
        } catch (error) {
            Logger.error(`${error}`);
            return Boom.badImplementation(error);
        }
    };
}

export default new Handler();
