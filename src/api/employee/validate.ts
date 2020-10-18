import * as Joi from '@hapi/joi';
import * as JoiObjectId from 'joi-objectid';
import KeyvalueConfig from '../../config/keyvalueConfig';
const JoiObjectIdInstance: any = JoiObjectId(Joi);

export default {
    search: {
        query: Joi.object().keys({
            'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
            page: Joi.number().integer().min(0).max(500000).required(),
            limit: Joi.number().integer().positive().min(1).max(1000).required(),
            skills:Joi.array().required().min(1).max(1000).items(JoiObjectIdInstance().required()).single(),
            state:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getStateArray('in'))).single(),
            city:Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000)).single(),
            district:Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000)).single(),
            contactNo:Joi.array().min(0).max(1000).items(Joi.string().required().trim().length(10).pattern(/^[0-9]+$/)).single()
        }).required()
    },
    findlimit: {
        query: Joi.object().keys({
            'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
            skills:Joi.array().required().min(0).max(1000).items(JoiObjectIdInstance().required()).single()
        }).required()
    }
};
