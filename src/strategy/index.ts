import * as Hapi from '@hapi/hapi';
import Logger from '../helper/logger';
import Utils from '../helper/utils';
import {connection, Model} from 'mongoose';
const JWT_PRIVATE_KEY = Utils.getEnvVariable('JWT_PRIVATE_KEY', true);

export default class Strategies {
    private static validate = async (decoded, request, h) => {
        try{
            const modal: Model<any> = connection.model('admin');
            const user: any  = await modal.findOne({
                _id: decoded.id,
                phoneNumber: decoded.phoneNumber,
                active: true
            }).select( 'password_changed_at verified');
            if (!user || !(decoded.password_changed_at === (user.password_changed_at).toISOString())) {
                return { isValid: false };
            }
            request.verified = user.verified;
            return { isValid: true };
        }
        catch(error){
            Logger.error(`${error}`);
            return { isValid: false };
        }
    };

    private static validateEmployer = async (decoded, request, h) => {
        try{
            const modal: Model<any> = connection.model('employer');
            const user: any  = await modal.findOne({
                _id: decoded.id,
                phoneNumber: decoded.phoneNumber,
                active: true,
                scope:decoded.scope
            }).select( 'password_changed_at');
            if (!user || !(decoded.password_changed_at === (user.password_changed_at).toISOString())) {
                return { isValid: false };
            }
            return { isValid: true };
        }
        catch(error){
            Logger.error(`${error}`);
            return { isValid: false };
        }
    };

    public static registerAll = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            await server.auth.strategy('admintoken', 'jwt',
                { key: JWT_PRIVATE_KEY,
                    validate:Strategies.validate,
                    verifyOptions: { algorithms: [ 'RS256' ]}
                });
            await server.auth.strategy('employertoken', 'jwt',
                { key: JWT_PRIVATE_KEY,
                    validate:Strategies.validateEmployer,
                    verifyOptions: { algorithms: [ 'RS256' ]}
                });
        } catch (error) {
            Logger.error(`Error in registering strategies: ${error}`);
            throw error;
        }
    };
}
