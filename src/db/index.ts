import Config from '../config/config';
import Logger from '../helper/logger';
import {connection, connect, ConnectionOptions} from 'mongoose';
import registration from '../model/registration';



export default class Db {
    public static async connect() {
        try{
                await connect('mongodb://' + Config.database.username + ':' + Config.database.password + '@' + Config.database.host + ':' + Config.database.port + '/' + Config.database.name + '?authSource=admin',
                    Config.databaseOptions as ConnectionOptions
                );
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

                connection.once('open', () => {
                    Logger.info('Connection with database succeeded');
                });

        }
        catch(error){
            Logger.error(`Error in connecting database: ${error}`);
            throw error;
        }

    };

    public static addModals = (): void =>{
        Db.models.registration = registration;
    };

    public static models:any ={};
};
