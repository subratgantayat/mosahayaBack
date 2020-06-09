import * as Joi from '@hapi/joi';

export default {
    create: {
        payload: Joi.object().keys({
            name:Joi.string().required().trim().min(1).max(1000),
            phoneNumber:Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
            password: Joi.string().min(8).max(50).required()
        }).required()
    },
    signin: {
        payload: Joi.object().keys({
            phoneNumber:Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
            password: Joi.string().min(8).max(50).required()
        }).required()
    }
};
