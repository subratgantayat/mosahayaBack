import Config from '../config/config';
import Logger from '../helper/logger';
import {connection, connect, ConnectionOptions} from 'mongoose';
import registration from '../model/registration';
import enrollment from '../model/enrollment';
import admin from '../model/admin';
import employee from '../model/employee';
import skill from '../model/skill';
import employer from '../model/employer';
import Utils from '../helper/utils';
import * as Mongoose from 'mongoose';
import * as Bluebird from 'bluebird';
import businessUser from '../model/business/businessUser';
import project from '../model/business/project';
import test1 from '../model/test1';
const NODE_ENV = Utils.getEnvVariable('NODE_ENV', false);

class Db {
    public connect = async (): Promise<void> => {
        try {
            (Mongoose as any).Promise = Bluebird;
            connection.setMaxListeners(0);

            connection.on('error', (err) => {
                Logger.error('MongoDB event error: ${error}');
            });

            connection.on('connected', () => {
                Logger.info('MongoDB event connected');
            });

            connection.on('disconnected', () => {
                Logger.info('MongoDB event disconnected');
            });

            connection.on('reconnected', () => {
                Logger.info('MongoDB event reconnected');
            });

            connection.on('open', () => {
                Logger.info('Connection with database succeeded');
            });
            if (NODE_ENV === 'development') {
                await connect('mongodb://' + Config.database.username + ':' + Config.database.password + '@' + Config.database.host + ':' + Config.database.port + '/' + Config.database.name + '?authSource=admin',
                    Config.databaseOptions as ConnectionOptions
                );
            } else {
                await connect('mongodb+srv://' + Config.database.username + ':' + encodeURIComponent(Config.database.password) + '@' + Config.database.host + '/' + Config.database.name+ '?retryWrites=true&w=majority',
                    Config.databaseOptions as ConnectionOptions
                );
            }

        } catch (error) {
            Logger.error('Error in connecting database: ', error);
            throw error;
        }

    };

    public addModals = (): void => {
        this.models.registration = registration;
        this.models.enrollment = enrollment;
        this.models.admin = admin;
        this.models.employee = employee;
        this.models.skill = skill;
        this.models.employer = employer;
        this.models.businessUser = businessUser;
        this.models.project = project;
        this.models.test1 = test1;
    };

    public models: any = {};
}

export default new Db();
