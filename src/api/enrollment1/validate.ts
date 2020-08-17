import * as Joi from '@hapi/joi';
import KeyvalueConfig from '../../config/keyvalueConfig';
import Config from '../../config/config';
import * as JoiObjectId from 'joi-objectid';

const JoiObjectIdInstance: any = JoiObjectId(Joi);

class Validate {
    public create: any = {
        payload: Joi.object().keys({
            'g-recaptcha-response': Joi.string().required().trim().min(1).max(10000),
            generalData: Joi.object().keys({
                registerBy: Joi.string().required().valid(...KeyvalueConfig.getValueArray('registerBy')),
                name: Joi.string().required().trim().min(1).max(1000).pattern(/^[a-z]([a-z,.'-]*)+(\s[a-z,.'-]+)*$/i),
                age: Joi.number().required().integer().min(14).max(80),
                gender: Joi.string().required().valid(...KeyvalueConfig.getValueArray('gender')),
                mobileNumber: Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
                pinCode: Joi.string().required().trim().length(6).pattern(/^([1-9])([0-9]){5}$/),
                address: Joi.string().trim().min(1).max(100000).pattern(/^[\x20-\x7E\s]+$/)
            }).required(),
            skillData: Joi.object().keys({
                sectors: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('skillsBySector'))),
                sectorsOther: Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000).pattern(/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i)),
                skills: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getSkillArray())),
                skillsOther: Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000).pattern(/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i)),
                experience: Joi.object().keys({
                    expYear: Joi.number().integer().min(0).max(150),
                    expMonth: Joi.number().integer().min(0).max(11)
                }),
                education: Joi.string().required().valid(...KeyvalueConfig.getValueArray('education')),
                preferredLocations: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getAllDistrictArray())),
                otherInfo: Joi.string().trim().min(1).max(100000).pattern(/^[\x20-\x7E\s]+$/)
            }).required(),
            healthData: Joi.object().keys({
                currentCondition: Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('currentCondition'))),
                currentConditionOther: Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000).pattern(/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i)),
                symptoms: Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('symptoms'))),
                symptomsOther: Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000).pattern(/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i))
            })
        }).required()
    };
    public find: any = {
        query: Joi.object().required().keys({
            page: Joi.number().required().integer().min(0).max(500000),
            limit: Joi.number().required().integer().positive().min(1).max(1000),
            sectors: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('skillsBySector'))).single(),
            sectorsOther: Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(1000).pattern(/^[\x20-\x7E\s]+$/)).single(),
            preferredLocations: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getAllDistrictArray())).single(),
            skills: Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getSkillArray())).single(),
            skillsOther: Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(1000).pattern(/^[\x20-\x7E\s]+$/)).single(),
            sort: Joi.string().valid('createdAt', 'name', 'age').default('createdAt'),
            sortOrder: Joi.string().valid(...Config.sortOrder).default(Config.defaultSortOrder)
        })
    };

    public findOne: any = {
        params: Joi.object().required().keys({
            id: JoiObjectIdInstance().required()
        })
    };

    public viewForm: any = {
        params: Joi.object({
            id: Joi.string().required().trim().length(16)
        }).required(),
        query: Joi.object().keys({
            'g-recaptcha-response': Joi.string().required().trim().min(1).max(10000)
        }).required()
    };
}

export default new Validate();
