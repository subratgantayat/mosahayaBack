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
                      'type': 'service_account',
                      'project_id': 'nearbybackend-d30f6',
                      'private_key_id': '70fb9d196efc4cea931fe5f2659c07f239089555',
                      'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4RkY7yWYaemDA\n5WPHk62FYPByWDZRtr4T78JHTx7tcYzaRHrWAqDSJdF1s1SXEljkeIOqnqMdpckq\nMY52qg+69YedYDRyjVhQVAZuhBNBKK0W8Geo1xhUJiP5dOi8uLgM93naKi8HyaTe\nm5rkQekMHZmMNL7Q/HqENx8uyk4I66z7y9vmkaXxoWc2iwPag6aecItwZldsoq35\nLAHDgBpPNSQmXUJDx7CZQrnfMUYG31LBY/CB0kNTn6+jZJuDROJMfxGGKnGh1s/g\nRh4uiP8CZGBxH3WKTNgv5rWAIfL8CLSB+7XgixBBdK7Fcnn4Z+MOJqEAhD8QFPG1\nmQkdUXHxAgMBAAECggEAAeZgYs034ZQ01PhO5MFhVVIDcjv1/2l7bZ6X6bIao9Ph\nlTFS9OVQPcQIp1NPtXXWd2PFgI5XKMvLSavHuyVHH6Q/Bc12oCtUTd7rHA7Kv6Ei\noiBpz5dVvfrD4/zWsEKiGMKHPct+jApO48Hfjg5R6Uwq1GojNFA0ffivHriuQLBG\ndKo9LHZMuyjikMklESDv3F0XQpdy6HJSz4nLjbLT1nve9OjPZHghS3/yprj4b3Cc\nVry25ydlj0rKMz7TkAnUQANA3oovtisYMUgansGXZizCkf96J4d/5KAphQmduuAa\nL95kUgssN2l6ovUGVbh/feKyk55LOC0I05oyp+z7EwKBgQD0vbXsF8sgHVbTXVRy\nuis01ApmOpHjQu9Ma+Ei/FApAv2e7/hGA2NMWH9jNvEeJVFPHm0aI4ejLdg/T+uH\nl09mZBorolajUcSnrlGMdPYdhSOohrL41LeeMs7APIg0a+R4VlKaBHbZK6aYwObZ\nSfumnoE5bB0aOXEzHjjqxoDb1wKBgQDAwHSjgO2zO5ohQKPGLX2dgvaPacTh7BXJ\n8bCZVZKMNj1DhkWnA7Bxk+hytF25LCLXSoRAxBfQfsGIB50kkTk6zX5J833IpZ3c\nILffyVSJTU3FrzoT/PqQloN2kj1Z5sarV0au9cTIMl+NYoTZV7AWGd/0K8Vt7ueP\nhaxTB86ndwKBgQDQl5SjSdA9aeQjt8sPEW9b0lGeudK3oMf2GYhEWkoz+jGRsjOn\n8KFEY7UHKb+uEt5PEb6pZZjoUl2Z8JLs+OCagzzu7ajr//gddmxYyyMtG9m9fDiz\n7hEly2X94FmyXDbY/bHfRWjKRfLzBI58qhrK8xNujp/rRwQdLmgSaedP9wKBgEWS\nccc+Vw21eql78mEqtEdxKNuU2rqNA0RT12FREMdJII3J3kQtQbeNIn6ceaPHuX+p\n5tiVrt7TkbkuvlqfjF+cInRAzerpVHRK3vOIcNnqLCMpXzYtvqcHnMXkfP6BHL5l\njx7BmNiFzhVzNO5aBzXC+yHf1rAaZjxYjF2f2Mh7AoGBAOakrRhbVpVDJh0UVxl0\ne+1m9K9fNV7WD+tgm61SmdIoK76QmfSLze7iHRecHZnBmrjagq6ztaPUC7wfKeHv\nP0nX7MbERlm9d1sRtcAPIlPTa3EbZ+Oo3AuU+dIXQkEPkGUyNlWNEOAUtYyoVHw5\nMajgdB5kt3scVE12v8+VAmI8\n-----END PRIVATE KEY-----\n',
                      'client_email': 'firebase-adminsdk-azx58@nearbybackend-d30f6.iam.gserviceaccount.com',
                      'client_id': '108555835639023634803',
                      'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
                      'token_uri': 'https://oauth2.googleapis.com/token',
                      'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
                      'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-azx58%40nearbybackend-d30f6.iam.gserviceaccount.com'
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
