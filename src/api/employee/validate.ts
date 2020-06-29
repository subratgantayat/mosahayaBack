import * as Joi from '@hapi/joi';
import * as JoiObjectId from 'joi-objectid';
 const JoiObjectIdInstance = JoiObjectId(Joi);

export default {
    search: {
        query: Joi.object().keys({
            page: Joi.number().integer().min(0).max(500000).required(),
            limit: Joi.number().integer().positive().min(1).max(1000).required(),
            skills:Joi.array().required().min(0).max(1000).items(JoiObjectIdInstance().required()).single()
        }).required(),
        params: Joi.object({
            grecaptcharesponse:Joi.string().required().trim().min(1).max(10000)
        }).required()
    }
};
