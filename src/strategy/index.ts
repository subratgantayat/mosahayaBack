import * as Hapi from '@hapi/hapi';
import Logger from '../helper/logger';
import Utils from '../helper/utils';
import BusinessController from '../api/business/businessUser/controller';
import {connection, Model} from 'mongoose';
/*import * as admin from 'firebase-admin';
import * as serviceAccount from '../config/nearbybackend-d30f6-firebase-adminsdk-azx58-70fb9d196e.json';*/
import * as Boom from '@hapi/boom';

const JWT_PRIVATE_KEY: string = Utils.getEnvVariable('JWT_PRIVATE_KEY', true);

export class Strategies {

    constructor() {
   /*     try {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as any)
                // databaseURL: "https://fbauthdemo-2a451.firebaseio.com"
            });
        } catch (err) {
            Logger.error('Error while initializing firebase', err);
            process.exit(1);
        }*/
    }

    private validateCompany = async (decoded, request, h) => {
        try {
            const modal: Model<any> = connection.model('admin');
            const user: any = await modal.findOne({
                _id: decoded.id,
                phoneNumber: decoded.phoneNumber,
                active: true,
                scope: decoded.scope
            }).select('password_changed_at').exec();
            if (!user || !(decoded.password_changed_at === (user.password_changed_at).toISOString())) {
                return {isValid: false};
            }
            return {isValid: true};
        } catch (error) {
            Logger.error(`Error: `, error);
            return {isValid: false};
        }
    };

    private validateEmployer = async (decoded, request, h) => {
        try {
            const modal: Model<any> = connection.model('employer');
            const user: any = await modal.findOne({
                _id: decoded.id,
                phoneNumber: decoded.phoneNumber,
                active: true,
                scope: decoded.scope
            }).select('password_changed_at').exec();
            if (!user || !(decoded.password_changed_at === (user.password_changed_at).toISOString())) {
                return {isValid: false};
            }
            return {isValid: true};
        } catch (error) {
            Logger.error(`Error: `, error);
            return {isValid: false};
        }
    };

    private validateBusiness = async (decoded, request, h) => {
        try {
            const modal: Model<any> = connection.model('businessuser');
            const user: any = await modal.findOne({
                _id: decoded.id,
                email: decoded.email,
                active: true,
                emailVerified: true,
                scope: decoded.scope
            }).select('password_changed_at profile.address').exec();
            if (!user || !(decoded.password_changed_at === (user.password_changed_at).toISOString())) {
                return {isValid: false};
            }
            return {isValid: true, credentials: {...decoded, ...{profileFilled: (!!user.profile)}}};
        } catch (error) {
            Logger.error(`Error: `, error);
            return {isValid: false};
        }
    };

    public registerAll = async (server: Hapi.Server): Promise<Error | any> => {
        try {
          //  await this.registerFirebaseScheme(server);
            await server.auth.strategy('admintoken', 'jwt',
                {
                    key: JWT_PRIVATE_KEY,
                    validate: this.validateCompany,
                    verifyOptions: {algorithms: ['HS256']}
                });
            await server.auth.strategy('employertoken', 'jwt',
                {
                    key: JWT_PRIVATE_KEY,
                    validate: this.validateEmployer,
                    verifyOptions: {algorithms: ['HS256']}
                });
            await server.auth.strategy('businesstoken', 'jwt',
                {
                    key: JWT_PRIVATE_KEY,
                    validate: this.validateBusiness,
                    verifyOptions: {algorithms: ['HS256']}
                });
           // await server.auth.strategy('firebase-mosahaya', 'firebase-mosahaya-scheme');
            /*  await server.auth.strategy('firebase', 'firebase', {
                  credential: {
                       }
              });*/
        } catch (error) {
            Logger.error('Error in registering strategies: ', error);
            throw error;
        }
    };

/*    private registerFirebaseScheme = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Scheme - Registering firebase');
            await server.auth.scheme('firebase-mosahaya-scheme', (): Hapi.ServerAuthSchemeObject => {
                return {
                    async authenticate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
                        const token: string = request.headers.authorization;
                        if (!(token && (typeof (token) === 'string'))) {
                            return Boom.unauthorized('Missing authentication');
                        }
                        try {
                            const result: any = await admin.auth().verifyIdToken(token);
                            if (!(result && result.uid && result.name && result.email && result.email_verified)) {
                                return Boom.unauthorized('Invalid token');
                            }
                            if (!(result.scope && result.mosahayaId)) {
                                const user: any = await BusinessController.create({
                                    name: result.name,
                                    email: result.email
                                });
                                if (!(user && user.scope && user._id)) {
                                    throw new Error('Error while creating user in mosahaya db');
                                }
                                await admin.auth().setCustomUserClaims(result.uid, {
                                    scope: user.scope,
                                    mosahayaId: user._id
                                });
                            }
                            console.log(result);
                            return h.authenticated({credentials: {}});
                        } catch (err) {
                            Logger.error('Firebase user create error: ', err);
                            return Boom.unauthorized('Invalid token');
                        }
                    }
                };
            });
        } catch (error) {
            Logger.error(`Error in registering pass-jwt schemes: ${error}`);
            throw error;
        }
    };*/
}

export default new Strategies();
