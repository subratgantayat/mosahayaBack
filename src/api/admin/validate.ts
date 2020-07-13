import * as Joi from '@hapi/joi';

export default {
    create: {
        payload: Joi.object().keys({
            name:Joi.string().required().trim().min(1).max(1000),
            phoneNumber:Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
            password: Joi.string().min(8).max(50).required(),
            secret:Joi.string().required().trim().min(1).max(1000)
        }).required()
    },
    signin: {
        payload: Joi.object().keys({
         /*   'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),*/
            phoneNumber:Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
            password: Joi.string().min(8).max(50).required()
        }).required()
    }
};
