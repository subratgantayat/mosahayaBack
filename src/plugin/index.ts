import * as Hapi from '@hapi/hapi';
import goodWinston from 'hapi-good-winston';
import Config from '../config/config';
import Logger from '../helper/logger';
import Utils from '../helper/utils';

const NODE_ENV: string = Utils.getEnvVariable('NODE_ENV', true);
const LOG_LEVEL: string = Utils.getEnvVariable('LOG_LEVEL', false);

class Plugins {

    public registerAll = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            await this.inert(server);
            await this.hapiGeoLocate(server);
           // await this.hapiFirebaseAuth(server);
            await this.hapiAuthMultipleStrategies(server);
            await this.hapiRateLimit(server);
            await this.hapiAuthJwt2(server);
            if (NODE_ENV === 'development' || NODE_ENV === 'test') {
                await this.vision(server);
                await this.swagger(server);
                Logger.info(`Visit: ${server.info.uri}/documentation for Swagger docs`);
            }
            await this.good(server);
            // if (LOG_LEVEL === 'debug') {
            server.ext({
                type: 'onRequest',
                method(request: Hapi.Request, h: Hapi.ResponseToolkit) {
                    if (request.url.pathname.substring(1, 10) === 'swaggerui' || request.url.pathname === '/documentation' || request.url.pathname === '/health' || request.url.pathname === '/swagger.json') {
                        return h.continue;
                    }
                    // @ts-ignore
                    Logger.info('Request Ip address: ', Utils.getIpAddress(request));
                    /*    if (request.headers['x-forwarded-for']) {
                            request.info.remoteAddress = request.headers['x-forwarded-for'].split(',')[0].trim();
                        }
                        if (request.headers['x-forwarded-port']) {
                            request.info.remotePort = request.headers['x-forwarded-port'];
                        }*/
                    Logger.debug('***** Request start *****');
                    Logger.debug(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.pathname);
                    Logger.debug('Request header:', request.headers);
                    Logger.debug('Request payload:', request.payload);
                    Logger.debug('Request params:', request.params);
                    Logger.debug('***** Request end *****');
                    return h.continue;
                }
            });
            server.events.on('response', (request: Hapi.Request) => {
                if (request.url.pathname.substring(1, 10) === 'swaggerui' || request.url.pathname === '/documentation' || request.url.pathname === '/health' || request.url.pathname === '/swagger.json') {
                    return;
                }
                Logger.debug('***** Response start *****');
                // @ts-ignore
                Logger.debug(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.url.pathname + ' --> ' + (request.response && request.response.statusCode ? request.response.statusCode : ''));
                // @ts-ignore
                Logger.debug('Response payload:', (request.response && request.response.source) ? request.response.source : '');
                Logger.debug('***** Response end *****');
            });

            server.events.on('request', (event, tags) => {
                if (tags.channel === 'internal') {
                    // @ts-ignore
                    Logger.error('Request error: ', tags.error);
                }
            });
            // }
        } catch (error) {
            Logger.error('Error in registering plugins: ', error);
            throw error;
        }

    };
    private hapiGeoLocate = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Plugins - Registering hapiGeoLocate');
            await this.register(server, [
                require('hapi-geo-locate')
            ]);
        } catch (error) {
            Logger.error('Plugins - Ups, something went wrong when registering hapiGeoLocate plugin: ', error);
            throw error;
        }
    };

    private hapiAuthJwt2 = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Plugins - Registering hapiAuthJwt2');
            await this.register(server, [
                require('hapi-auth-jwt2')
            ]);
        } catch (error) {
            Logger.error('Plugins - Ups, something went wrong when registering hapiAuthJwt2 plugin: ', error);
            throw error;
        }
    };

    private hapiAuthMultipleStrategies = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Plugins - Registering hapiAuthMultipleStrategies');
            await this.register(server, [
                require('hapi-auth-multiple-strategies')
            ]);
        } catch (error) {
            Logger.error('Plugins - Ups, something went wrong when registering hapiAuthMultipleStrategies plugin: ', error);
            throw error;
        }
    };

 /*   private hapiFirebaseAuth = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Plugins - Registering hapiFirebaseAuth');
            await this.register(server, [
                require('hapi-firebase-auth')
            ]);
        } catch (error) {
            Logger.error('Plugins - Ups, something went wrong when registering hapiFirebaseAuth plugin: ', error);
            throw error;
        }
    };*/

    private hapiRateLimit = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Plugins - Registering hapiRateLimit');
            await this.register(server, [
                {
                    options: {
                        userLimit: 200
                    },
                    plugin: require('hapi-rate-limit')
                }
            ]);
        } catch (error) {
            Logger.error('Plugins - Ups, something went wrong when registering hapiRateLimit plugin: ', error);
            throw error;
        }
    };
    private vision = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Plugins - Registering vision');
            await this.register(server, [
                require('@hapi/vision')
            ]);
        } catch (error) {
            Logger.error('Plugins - Ups, something went wrong when registering vision plugin: ', error);
            throw error;
        }
    };
    private inert = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Plugins - Registering inert');
            await this.register(server, [
                require('@hapi/inert')
            ]);
        } catch (error) {
            Logger.error('Plugins - Ups, something went wrong when registering inert plugin: ', error);
            throw error;
        }
    };

    private swagger = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Plugins - Registering hapi-swagger');
            await this.register(server, [
                {
                    options: Config.swagger.options,
                    plugin: require('hapi-swagger')
                }
            ]);
        } catch (error) {
            Logger.error('Plugins - Ups, something went wrong when registering hapi-swagger plugin: ', error);
            throw error;
        }
    };

    private good = async (server: Hapi.Server): Promise<Error | any> => {
        try {
            Logger.info('Plugins - Registering good');

            const goodWinstonOptions: object = {
                levels: {
                    request: 'debug',
                    response: 'debug',
                    error: 'error'
                }
            };
            const options: object = {
                ops: false,
                includes: {
                    request: ['headers', 'payload'],
                    response: ['headers', 'payload']
                },
                reporters: {
                    winstonWithLogLevels: [
                        {
                            module: 'good-squeeze',
                            name: 'Squeeze',
                            args: [{error: '*'}]
                        },
                        /*  {
                              module: 'good-squeeze',
                              name: 'SafeJson'
                          },
                          {
                              module: 'good-console'
                          },
                          'stdout'*/
                        goodWinston(Logger, goodWinstonOptions)
                    ]
                }
            };
            await this.register(server, [{
                plugin: require('good'),
                options
            }]);
        } catch (error) {
            Logger.error('Plugins - Ups, something went wrong when registering good: ', error);
            throw error;
        }
    };

    private register = async (server: Hapi.Server, plugin: any): Promise<Error | any> => {
        return new Promise(async (resolve, reject) => {
            try {
                await server.register(plugin);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    };
}

export default new Plugins();
