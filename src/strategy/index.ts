import * as Hapi from '@hapi/hapi';
import Logger from '../helper/logger';
import Utils from '../helper/utils';
import {connection, Model} from 'mongoose';
const JWT_PRIVATE_KEY:string = Utils.getEnvVariable('JWT_PRIVATE_KEY', true);

export class Strategies {
    private validateCompany = async (decoded, request, h) => {
        try{
            const modal: Model<any> = connection.model('admin');
            const user: any  = await modal.findOne({
                _id: decoded.id,
                phoneNumber: decoded.phoneNumber,
                active: true,
                scope:decoded.scope
            }).select( 'password_changed_at').exec();
            if (!user || !(decoded.password_changed_at === (user.password_changed_at).toISOString())) {
                return { isValid: false };
            }
            return { isValid: true };
        }
        catch(error){
            Logger.error(`Error: `, error);
            return { isValid: false };
        }
    };

    private validateEmployer = async (decoded, request, h) => {
        try{
            const modal: Model<any> = connection.model('employer');
            const user: any  = await modal.findOne({
                _id: decoded.id,
                phoneNumber: decoded.phoneNumber,
                active: true,
                scope:decoded.scope
            }).select( 'password_changed_at').exec();
            if (!user || !(decoded.password_changed_at === (user.password_changed_at).toISOString())) {
                return { isValid: false };
            }
            return { isValid: true };
        }
        catch(error){
            Logger.error(`Error: `, error);
            return { isValid: false };
        }
    };

    private validateBusiness = async (decoded, request, h) => {
        try{
            const modal: Model<any> = connection.model('businessuser');
            const user: any  = await modal.findOne({
                _id: decoded.id,
                email: decoded.email,
                active: true,
                emailVerified: true,
                scope:decoded.scope
            }).select( 'password_changed_at profile.address').exec();
            if (!user || !(decoded.password_changed_at === (user.password_changed_at).toISOString())) {
                return { isValid: false };
            }
            return { isValid: true, credentials:{...decoded,...{profileFilled: (!!user.profile)}} };
        }
        catch(error){
            Logger.error(`Error: `, error);
            return { isValid: false };
        }
    };

    public registerAll = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            await server.auth.strategy('admintoken', 'jwt',
                { key: JWT_PRIVATE_KEY,
                    validate:this.validateCompany,
                    verifyOptions: { algorithms: [ 'HS256' ]}
                });
            await server.auth.strategy('employertoken', 'jwt',
                { key: JWT_PRIVATE_KEY,
                    validate:this.validateEmployer,
                    verifyOptions: { algorithms: [ 'HS256' ]}
                });
            await server.auth.strategy('businesstoken', 'jwt',
                { key: JWT_PRIVATE_KEY,
                    validate:this.validateBusiness,
                    verifyOptions: { algorithms: [ 'HS256' ]}
                });
        } catch (error) {
            Logger.error('Error in registering strategies: ', error);
            throw error;
        }
    };
}

export default new Strategies();
