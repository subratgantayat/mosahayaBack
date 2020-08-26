import * as Hapi from '@hapi/hapi';
import Logger from '../helper/logger';
import Utils from '../helper/utils';
import {connection, Model} from 'mongoose';
import BusinessController from '../api/business/businessUser/controller';
import * as FirebaseAdmin from 'firebase-admin';
import * as Boom from '@hapi/boom';

const JWT_PRIVATE_KEY: string = Utils.getEnvVariable('JWT_PRIVATE_KEY', true);

export class Strategies {

    constructor() {
        try {
        FirebaseAdmin.initializeApp({
            credential: FirebaseAdmin.credential.applicationDefault()
        });
        } catch (err) {
            Logger.error('Error while initializing firebase', err);
            process.exit(1);
        }
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
            await this.registerFirebaseScheme(server);
            await this.registerProfileExistScheme(server);
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
            await server.auth.strategy('businessjwttoken', 'jwt',
                {
                    key: JWT_PRIVATE_KEY,
                    validate: this.validateBusiness,
                    verifyOptions: {algorithms: ['HS256']}
                });
            await server.auth.strategy('firebase-mosahaya', 'firebase-mosahaya-scheme');
            await server.auth.strategy('profile-exist', 'profile-exist-scheme');
            await server.auth.strategy('businesstoken', 'multiple-strategies', {
                strategies: ['firebase-mosahaya', 'profile-exist']
            });
        } catch (error) {
            Logger.error('Error in registering strategies: ', error);
            throw error;
        }
    };

    private registerFirebaseScheme = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Scheme - Registering firebase-mosahaya-scheme');
            await server.auth.scheme('firebase-mosahaya-scheme', (): Hapi.ServerAuthSchemeObject => {
                return {
                    async authenticate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
                        const token: string = request.headers.authorization;
                        if (!(token && (typeof (token) === 'string'))) {
                            return Boom.unauthorized('Missing authentication');
                        }
                        try {
                            const result: any = await FirebaseAdmin.auth().verifyIdToken(token);
                            if (!(result && result.uid && result.name && result.email && result.email_verified)) {
                                return Boom.unauthorized('Invalid token');
                            }
                            if (!(result.scope && result.mosahayaId)) {
                                let user: any = await BusinessController.checkUID(result.uid);
                                if (!user) {
                                    user = await BusinessController.create({
                                        name: result.name,
                                        email: result.email,
                                        uid: result.uid
                                    });
                                    if (!(user && user.scope && user._id)) {
                                        throw new Error('Error while creating user in mosahaya db');
                                    }
                                    await FirebaseAdmin.auth().setCustomUserClaims(result.uid, {
                                        scope: user.scope,
                                        mosahayaId: user._id
                                    });
                                } else {
                                    result.profileExist = !!user.profile;
                                }
                                result.scope = user.scope;
                                result.mosahayaId = user._id;
                            }
                            // @ts-ignore
                            request.profileExist = result.profileExist;
                            return h.authenticated({
                                credentials: {
                                    uid: result.uid,
                                    id: result.mosahayaId,
                                    scope: result.scope,
                                    profileExist: !!result.profileExist
                                }
                            });
                        } catch (err) {
                            Logger.error('Firebase user create error: ', err);
                            return Boom.unauthorized('Invalid token');
                        }
                    }
                };
            });
        } catch (error) {
            Logger.error(`Error in registering firebase-mosahaya-scheme schemes: ${error}`);
            throw error;
        }
    };

    private registerProfileExistScheme = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Scheme - Registering profile-exist-scheme');
            await server.auth.scheme('profile-exist-scheme', (): Hapi.ServerAuthSchemeObject => {
                return {
                    async authenticate(request: Hapi.Request, h: Hapi.ResponseToolkit) {
                        // @ts-ignore
                        if (!request.profileExist) {
                            return Boom.unauthorized('No profile');
                        }
                        return h.authenticated({credentials: {}});
                    }
                };
            });
        } catch (error) {
            Logger.error(`Error in registering profile-exist-scheme schemes: ${error}`);
            throw error;
        }
    };
}

export default new Strategies();
