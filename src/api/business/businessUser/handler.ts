import * as Boom from '@hapi/boom';
import * as Hapi from '@hapi/hapi';
import Logger from '../../../helper/logger';
import {connection, Model} from 'mongoose';
import EXTERNALIZED_STRING from '../../../assets/string-constants';
import * as FirebaseAdmin from 'firebase-admin';
const STRING: any = EXTERNALIZED_STRING.business.businessUser;
/*import Utils from '../../../helper/utils';
import {sign} from 'jsonwebtoken';
const JWT_PRIVATE_KEY: string = Utils.getEnvVariable('JWT_PRIVATE_KEY', true);*/

class Handler {
    private profileFields:  string[] = ['name','designation','address','sectors','sectorsOther','skills','skillsOther','yearOfExperience','geographyOfOp','largestContract','nameOfFounder','typeOfProjectManaged','companyWorkedWith','website','compliance','resources'];

    /*   public checkEmailExist:any = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            let {email}: any =  request.query;
            email = email.toLowerCase();
            let emailExist: boolean = false;
            const modal: Model<any> = connection.model('businessuser');
            const data: any =  await modal.findOne({email}).select('_id').lean(true).exec();
            if(data){
                emailExist = true;
            }
            return {emailExist};
        } catch (error) {
            if (error.name === 'MongoError' && error.code === 11000) {
                return Boom.badData(STRING.PHONE_NUMBER_EXIST);
            }
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public signup: any = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const payload: any =  request.payload;
            payload.email = payload.email.toLowerCase();
            payload.name = payload.name.toLowerCase();
            const modal: Model<any> = connection.model('businessuser');
            payload.password = await Utils.encryptArgon2(payload.password);
            payload.password_changed_at = new Date();
            payload.emailVerified = true;
            const newModal: any = new modal(payload);
            const data: any = await newModal.save();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CREATING);
            }
            const tokenData: any = {
                email: data.email,
                scope: data.scope,
                id: data._id,
                password_changed_at: data.password_changed_at
            };
            return {message: STRING.success.SIGNUP_SUCCESSFUL, token: sign(tokenData, JWT_PRIVATE_KEY),
                user: {
                    email: data.email,
                    name: data.name,
                    isAdmin: data.scope.includes('admin')
                }};
        } catch (error) {
            Logger.error(`Error: `, error);
            if (error.name === 'MongoError' && error.code === 11000) {
                return Boom.badData(STRING.error.EMAIL_ALREADY_TAKEN);
            }
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            return Boom.badImplementation(error);
        }
    };

    public signin: any = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const payload: any = request.payload;
            payload.email = payload.email.toLowerCase();
            const modal: Model<any> = connection.model('businessuser');
            const data: any =  await modal.findOne({email:payload.email}).select('password name email emailVerified active scope password_changed_at').lean(true).exec();
            if(!(data && await Utils.comparePasswordArgon2(payload.password, data.password))){
                return Boom.badData(STRING.error.INVALID_LOGIN);
            }
            if(!data.emailVerified){
                return Boom.badData(STRING.error.EMAIL_NOT_VERIFIED);
            }
            if(!data.active){
                return Boom.badData(STRING.error.INACTIVE_USER);
            }
            const tokenData: any = {
                email: data.email,
                scope: data.scope,
                id: data._id,
                password_changed_at: data.password_changed_at
            };
            return {message: STRING.success.SIGNIN_SUCCESSFUL, token: sign(tokenData, JWT_PRIVATE_KEY),
                user: {
                    email: data.email,
                    name: data.name,
                    isAdmin: data.scope.includes('admin')
                }};
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public verifyToken: any = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const credentials: any = request.auth.credentials;
            return { validToken:true, profileFilled: credentials.profileFilled};
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public changePassword = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            console.log(request.auth.credentials);
            const payload: any = request.payload;
            if (payload.currentPassword === payload.newPassword) {
                return Boom.notAcceptable(STRING.error.SAME_PASSWORD);
            }
            const credentials: any = request.auth.credentials;
            const modal: Model<any> = connection.model('businessuser');
            const data: any =  await modal.findById(credentials.id).select('password name email emailVerified active scope password_changed_at').exec();
            if(!(data && await Utils.comparePasswordArgon2(payload.currentPassword, data.password))){
                return Boom.badData(STRING.error.PASSWORD_NOT_MATCHED);
            }
            data.password = await Utils.encryptArgon2(payload.newPassword);
            data.password_changed_at = new Date();
            const result: any = await data.save();
            if (!result) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_CREATING);
            }
            const tokenData: any = {
                email: result.email,
                scope: result.scope,
                id: result._id,
                password_changed_at: result.password_changed_at
            };
            return {message: STRING.success.PASSWORD_CHANGE_SUCCESSFUL, token: sign(tokenData, JWT_PRIVATE_KEY),
                user: {
                    email: result.email,
                    name: result.name,
                    isAdmin: result.scope.includes('admin')
                }};
        } catch (error) {
            Logger.error(`Error: `, error);
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            return Boom.badImplementation(error);
        }
    };*/

    public verifyToken: any = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const credentials: any = request.auth.credentials['firebase-mosahaya'];
            return { validToken:true, profileFilled: credentials.profileExist};
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public profileEdit = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const payload: any = request.payload;
            const credentials: any = request.auth.credentials;
            const modal: Model<any> = connection.model('businessuser');
            const data: any = await modal.findOneAndUpdate({
                _id: credentials.id
            }, {$set: {profile: payload}}, {new: true, fields: 'uid scope _id profile'}).exec();
            if (!data) {
                return Boom.badData(STRING.error.INVALID_USER);
            }
            if(!credentials.profileExist){
                await FirebaseAdmin.auth().setCustomUserClaims(data.uid, {
                    scope: data.scope,
                    mosahayaId: data._id,
                    profileExist: true
                });
            }
            return {
                message: STRING.success.PROFILE_EDIT_SUCCESSFUL,
                profile: data.profile.toObject()
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            if (error.name === 'ValidationError') {
                return Boom.badData(error.message);
            }
            return Boom.badImplementation(error);
        }
    };

    public profileSelf = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const credentials: any = request.auth.credentials['firebase-mosahaya'];
            const modal: Model<any> = connection.model('businessuser');
            const data: any =  await modal.findById(credentials.id).select('profile').lean(true).exec();
            if(!data){
                return Boom.badData(STRING.error.INVALID_USER);
            }
            if(!data.profile){
                return Boom.badData(STRING.error.NO_PROFILE);
            }
            return {
                message: STRING.success.PROFILE_READ_SUCCESSFUL,
                profile: data.profile
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public profileSearch = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const credentials: any = request.auth.credentials['firebase-mosahaya'];
            const andOp: any = {'profile.sectors': {$in: request.query.sectors}, 'profile.geographyOfOp': {$in: request.query.geographyOfOp},active: true,emailVerified: true,profile: {$exists : true},_id: {$ne: credentials.id}};
            if(request.query.yearOfExperience){
                andOp['profile.yearOfExperience']= {$gte: request.query.yearOfExperience};
            }

            for (const prop of ['profile.sectorsOther']) {
                const p: string = prop.split('.')[1] || prop;
                if (request.query[p]) {
                    const b: any[] = [];
                    for (const a of request.query[p]) {
                        b.push(new RegExp(a, 'i'));
                    }
                    andOp[prop] = {$in: b};
                }
            }
            for (const prop of ['labourContractorLicense', 'gstRegd', 'providentFund', 'esic', 'gratuity']) {
                if (request.query[prop]) {
                    andOp['profile.'+prop] = request.query[prop];
                }
            }
            const admin: boolean = credentials.scope && credentials.scope.includes('admin');
            const select: any ={};
            for(const item of this.profileFields){
                select['profile.'+item] = 1;
            }
            if(admin){
                select['profile.contact'] =1;
            }
            const sortOrder:number = request.query.sortOrder === 'asc' ? 1 :-1;
            const sort: any = {};
            if(request.query.sort === 'yearOfExperience'){
                sort['profile.yearOfExperience'] = sortOrder;
            } else{
                sort[request.query.sort.toString()] = sortOrder;
            }
            const limit: number = parseInt(request.query.limit.toString(), 10);
            const skip: number = limit * parseInt(request.query.page.toString(), 10);
            const modal: Model<any> = connection.model('businessuser');
            const data: any[] = await modal.find(andOp).sort(sort).skip(skip).limit(limit).select(select).lean(true).exec();
            const count: number = await modal.find(andOp).countDocuments().exec();
            if (!data) {
                return Boom.badGateway(EXTERNALIZED_STRING.global.ERROR_IN_READING);
            }
            return {
                message: STRING.success.PROFILE_SEARCH_SUCCESSFUL,
                profiles: data,
                count
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };

    public profileOne = async (request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> =>{
        try {
            const {id}: any = request.params;
            const andOp: any = {_id: id, active: true,emailVerified: true,profile: {$exists : true}};
            const credentials: any = request.auth.credentials['firebase-mosahaya'];
            const admin: boolean = credentials.scope && credentials.scope.includes('admin');
            const select: any ={};
            for(const item of this.profileFields){
                select['profile.'+item] = 1;
            }
            if(admin){
                select['profile.contact'] =1;
            }
            const modal: Model<any> = connection.model('businessuser');
            const data: any = await modal.findOne(andOp).select(select).lean(true).exec();
            if (!data) {
                return Boom.badData(STRING.error.INVALID_USER);
            }
            return {
                message: STRING.success.PROFILE_ONE_SUCCESSFUL,
                profile: data
            };
        } catch (error) {
            Logger.error(`Error: `, error);
            return Boom.badImplementation(error);
        }
    };
}

export default new Handler();
