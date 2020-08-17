import * as Joi from '@hapi/joi';
import KeyvalueConfig from '../../../config/keyvalueConfig';
import Config from '../../../config/config';
import * as JoiObjectId from 'joi-objectid';
const JoiObjectIdInstance: any = JoiObjectId(Joi);

class Validate{
    private signUpOutput: any = {
        schema: Joi.object().required().keys({
            message:Joi.string().required(),
            token:Joi.string().required(),
            user:Joi.object().required().keys({
                email:Joi.string().required().trim().email(),
                name:Joi.string().required(),
                isAdmin: Joi.boolean().required()
            })
        }),
        failAction: Config.failAction
    };

    private profile: any = Joi.object().required().keys({
        address: Joi.string().required().min(1).max(100000).pattern(/^[\x20-\x7E\s]+$/),
        skills:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getSkillArray())),
        sectors:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('skillsBySector'))),
        sectorsOther:Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000).pattern(/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i)),
        skillsOther:Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000).pattern(/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i)),
        yearOfExperience:Joi.number().integer().min(0).max(1000),
        geographyOfOp:Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getAllDistrictArray())),
        largestContract: Joi.object().keys({
            price:Joi.number().integer().min(0).max(10000000000),
            manpowerEmployed:Joi.number().integer().min(0).max(10000000000)
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
    }).unknown(true);

    private pointOfContact: any = Joi.object().keys({
        name:Joi.string().required().trim().min(1).max(1000).pattern( /^[a-z]([a-z,.'-]*)+(\s[a-z,.'-]+)*$/i),
        email:Joi.string().required().trim().email().min(5).max(100),
        phoneNumber:Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
        designation:Joi.string().required().trim().min(1).max(1000)
    });

    private fullProfile: any = Joi.object().keys({
        name:Joi.string().required().trim().min(1).max(1000).pattern(/^[a-z0-9]+([\sa-z0-9@&:'./()_-])*$/i),
        email:Joi.string().trim().email().min(5).max(1000).lowercase(),
        profile:this.profile.append({
            pointOfContact: this.pointOfContact
        })
    }).unknown(true);

    public checkEmailExist: any = {
        input:{
            query: Joi.object().required().keys({
                'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
                email:Joi.string().required().trim().email().min(5).max(1000).lowercase()
            })
        },
        output:{
            schema:  Joi.object().required().keys({
                emailExist:Joi.boolean().required()
            }),
            failAction: Config.failAction
        }
    };
    public signup : any = {
        input:{
            payload: Joi.object().required().keys({
                'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
                name:Joi.string().required().trim().min(1).max(1000).pattern(/^[a-z0-9]+([\sa-z0-9@&:'./()_-])*$/i),
                email:Joi.string().required().trim().email().min(5).max(1000).lowercase(),
                password: Joi.string().min(8).max(50).required()
            })
        },
        output: this.signUpOutput
    };
    public signin : any = {
        input:{
            payload: Joi.object().required().keys({
                'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
                email:Joi.string().required().trim().email().min(5).max(1000).lowercase(),
                password: Joi.string().min(8).max(50).required()
            })
        },
        output: this.signUpOutput
    };
    public verifyToken: any = {
        output:{
            schema:  Joi.object().required().keys({
                validToken:Joi.boolean().required(),
                profileFilled:Joi.boolean().required()
            }),
            failAction: Config.failAction
        }
    };
    public changePassword : any= {
        input:{
            payload: Joi.object().required().keys({
                currentPassword: Joi.string().required().min(8).max(50),
                newPassword: Joi.string().required().min(8).max(50).required()
            })
        },
        output: this.signUpOutput
    };

    public profileEdit: any = {
        input:{
            payload: this.profile.append({
                pointOfContact: this.pointOfContact.required()
            })
        },
        output:{
            schema: Joi.object().required().keys({
                message:Joi.string().required(),
                profile: this.profile.append({
                    pointOfContact: this.pointOfContact.required()
                })
            }),
            failAction: Config.failAction
        }
    };
    public profileSelf: any = {
        output:{
            schema: Joi.object().required().keys({
                message:Joi.string().required(),
                profile: this.profile.append({
                    pointOfContact: this.pointOfContact.required()
                })
            }),
            failAction: Config.failAction
        }
    };

    public profileSearch: any = {
        input:{
            query: Joi.object().required().keys({
                page: Joi.number().required().integer().min(0).max(500000),
                limit: Joi.number().required().integer().positive().min(1).max(1000),
                sectors: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('skillsBySector'))).single(),
                sectorsOther:Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(1000).pattern(/^[\x20-\x7E\s]+$/)).single(),
                geographyOfOp: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getAllDistrictArray())).single(),
                yearOfExperience: Joi.number().integer().min(0).max(1000),
                labourContractorLicense: Joi.boolean(),
                gstRegd: Joi.boolean(),
                providentFund: Joi.boolean(),
                esic: Joi.boolean(),
                gratuity: Joi.boolean(),
                sort:Joi.string().valid('createdAt','yearOfExperience').default('createdAt'),
                sortOrder: Joi.string().valid(...Config.sortOrder).default(Config.defaultSortOrder)
            })
        },
        output:{
            /* schema(out, options){
                  console.log('aaa1');
                 const admin: boolean = options.context.credentials.scope && options.context.credentials.scope.includes('admin');
                 let schema: any = Joi.object().required().keys({
                         message1:Joi.string().required(),
                         profiles: Joi.array().required().min(0).max(1000).items(
                             Joi.object().required().keys({
                                 name:Joi.string().required().trim().min(1).max(1000).pattern(/^[a-z0-9]+([\sa-z0-9@&:'./()_-])*$/i),
                                 profile:this.profile
                             })
                         ),
                         count: Joi.number().integer().min(0).max(1000)
                     });
                 if (admin) {
                     schema = schema.Joi.object().required().keys({
                         message:Joi.string().required(),
                         profiles: Joi.array().required().min(0).max(1000).items(
                             Joi.object().required().keys({
                                 name:Joi.string().required().trim().min(1).max(1000).pattern(/^[a-z0-9]+([\sa-z0-9@&:'./()_-])*$/i),
                                 email:Joi.string().required().trim().email().min(5).max(1000).lowercase(),
                                 profile:this.profile.append(this.pointOfContact)
                             })
                         ),
                         count: Joi.number().integer().min(0).max(1000)
                     });
                 }
                 const { error, value } = schema.validate(out);
                 if (error) {
                     throw error;
                 }
                 return value;
             },*/
            schema:Joi.object().required().keys({
                message:Joi.string().required(),
                profiles: Joi.array().required().min(0).max(1000).items(
                    this.fullProfile
                ),
                count: Joi.number().required().integer().min(0).max(1000)
            }),
            failAction: Config.failAction
        }
    };

    public profileOne: any = {
        input:{
            params: Joi.object().required().keys({
                id: JoiObjectIdInstance().required()
            })
        },
        output:{
            schema:Joi.object().required().keys({
                message:Joi.string().required(),
                profile: this.fullProfile.required()
            }),
            failAction: Config.failAction
        }
    };
}

export default new Validate();
