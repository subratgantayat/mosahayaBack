import * as Joi from '@hapi/joi';
import KeyvalueConfig from '../../../config/keyvalueConfig';
import CityConfig from '../../../config/cityConfig';
import Config from '../../../config/config';

class Validate{
    public checkEmailExist: any = {
        input:{
            query: Joi.object().keys({
                'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
                email:Joi.string().required().trim().email().min(5).max(1000)
            }).required()
        },
        output:{
            schema:  Joi.object().keys({
                emailExist:Joi.boolean().required()
            }).required(),
            failAction: Config.failAction,
            sample:1
        }
    };
    public signup : any = {
        input:{
            payload: Joi.object().keys({
                'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
                name:Joi.string().required().trim().min(1).max(1000).pattern(/^[a-z0-9]+([\sa-z0-9@&:'./()_-])*$/i),
                email:Joi.string().required().trim().email().min(5).max(1000),
                password: Joi.string().min(8).max(50).required()
            }).required()
        },
        output:{
            schema:  Joi.object().keys({
                message:Joi.string().required(),
                token:Joi.string().required(),
                user:Joi.object().keys({
                    email:Joi.string().required().trim().email(),
                    name:Joi.string().required(),
                    isAdmin: Joi.boolean().required()
                }).required()
            }).required(),
            failAction: Config.failAction,
            sample:1
        }

    };
    public signin : any = {
        input:{
            payload: Joi.object().keys({
                'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
                email:Joi.string().required().trim().email().min(5).max(1000),
                password: Joi.string().min(8).max(50).required()
            }).required()
        },
        output:{
            schema:  Joi.object().keys({
                message:Joi.string().required(),
                token:Joi.string().required(),
                user:Joi.object().keys({
                    email:Joi.string().required().trim().email(),
                    name:Joi.string().required(),
                    isAdmin: Joi.boolean().required()
                }).required()
            }).required(),
            failAction: Config.failAction,
            sample:1
        }
    };
    public verifyToken: any = {
        output:{
            schema:  Joi.object().keys({
                validToken:Joi.boolean().required(),
                profileFilled:Joi.boolean().required()
            }).required(),
            failAction: Config.failAction,
            sample:1
        }
    };
    public changePassword : any= {
        input:{
            payload: Joi.object().keys({
                currentPassword: Joi.string().required().min(8).max(50),
                newPassword: Joi.string().required().min(8).max(50).required()
            }).required()
        },
        output:{
            schema:  Joi.object().keys({
                message:Joi.string().required(),
                token:Joi.string().required(),
                user:Joi.object().keys({
                    email:Joi.string().required().trim().email(),
                    name:Joi.string().required(),
                    isAdmin: Joi.boolean().required()
                }).required()
            }).required(),
            failAction: Config.failAction,
            sample:1
        }
    };
    private profile: any = Joi.object().keys({
        address: Joi.string().required().min(1).max(100000).pattern(/^[\x20-\x7E\s]+$/),
        skills:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getSkillArray())),
        sectors:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('skillsBySector'))),
        yearOfExperience:Joi.number().integer().min(0).max(1000),
        geographyOfOp:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...CityConfig.getCityArray())),
        largestContract: Joi.object().keys({
            price:Joi.number().integer().min(0).max(10000000000),
            manpowerEmployed:Joi.number().integer().min(0).max(10000000000)
        }),
        pointOfContact: Joi.object().keys({
            name:Joi.string().trim().min(1).max(1000).pattern( /^[a-z]([a-z,.'-]*)+(\s[a-z,.'-]+)*$/i),
            email:Joi.string().trim().email().min(5).max(100),
            phoneNumber:Joi.string().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
            designation:Joi.string().trim().min(1).max(1000)
        }),
        nameOfFounder:Joi.string().trim().min(1).max(1000).pattern( /^[a-z]([a-z,.'-]*)+(\s[a-z,.'-]+)*$/i),
        typeOfProjectManaged:Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000).pattern(/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i)),
        companyWorkedWith:Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000).pattern(/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i)),
        website: Joi.string().trim().uri().min(5).max(10000),
        resources: Joi.object().keys({
            plantMachinery:Joi.number().integer().min(0).max(100000),
            humanResources:Joi.number().integer().min(0).max(1000000)
        }),
        compliance:Joi.object().required().keys({
            labourContractorLicense: Joi.boolean(),
            gstRegd: Joi.boolean(),
            providentFund: Joi.boolean(),
            esic: Joi.boolean(),
            gratuity: Joi.boolean()
        })
    }).required();
    public profileEdit: any = {
        input:{
            payload: this.profile
        },
        output:{
            schema:  Joi.object().keys({
                message:Joi.string().required(),
                profile: this.profile
            }).required(),
            failAction: Config.failAction,
            sample:1
        }
    };
}

export default new Validate();
