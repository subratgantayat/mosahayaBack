import * as Joi from '@hapi/joi';
import KeyvalueConfig from '../../config/keyvalueConfig';

export default {
    create: {
        payload: Joi.object().keys({
            generalData:Joi.object().keys({
                registerBy:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('registerBy')),
                name:Joi.string().required().trim().min(1).max(1000),
                age:Joi.number().required().integer().min(1).max(150),
                gender:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('gender')),
                mobileNumber:Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
                pinCode:Joi.string().required().trim().length(6).pattern(/^([1-9])([0-9]){5}$/),
                address:Joi.string().trim().min(1).max(100000)
            }).required(),
            skillData:Joi.object().keys({
                skills:Joi.array().required().min(0).max(1000).items(Joi.string().valid( ...KeyvalueConfig.getValueArray('skills'))),
                skillsOther:Joi.string().trim().min(1).max(10000),
                sectors:Joi.array().required().min(0).max(1000).items(Joi.string().valid( ...KeyvalueConfig.getValueArray('sectors'))),
                sectorsOther:Joi.string().trim().min(1).max(10000),
                experience: Joi.number().integer().min(0).max(150),
                education:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('education')),
                preferredLocation:Joi.string().required().trim().min(1).max(100000)
            }).required(),
            healthData:Joi.object().keys({
                currentCondition:Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('currentCondition'))),
                currentConditionOther:Joi.string().trim().min(1).max(10000),
                symptoms:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('symptoms'))),
                symptomsOther:Joi.string().trim().min(1).max(10000),
                otherInfo:Joi.string().trim().min(1).max(100000)
            })
        }).required()
    },
    viewForm: {
        params: Joi.object({
            id: Joi.string().required().trim().min(1).max(100)
        }).required()
    }
};
