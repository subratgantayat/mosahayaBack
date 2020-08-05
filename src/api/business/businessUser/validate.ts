import * as Joi from '@hapi/joi';

export default {
    checkEmailExist: {
        query: Joi.object().keys({
            'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
            email:Joi.string().required().trim().email().min(5).max(1000)
        }).required()
    },
    signup:{
        payload: Joi.object().keys({
            'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
            name:Joi.string().required().trim().min(1).max(1000).pattern(/^[a-z0-9]+([\sa-z0-9@&:'./()_-])*$/i),
            email:Joi.string().required().trim().email().min(5).max(1000),
            password: Joi.string().min(8).max(50).required()
        }).required()
    },
    signin:{
        payload: Joi.object().keys({
            'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000),
            email:Joi.string().required().trim().email().min(5).max(1000),
            password: Joi.string().min(8).max(50).required()
        }).required()
    },
    changePassword: {
        payload: Joi.object().keys({
            currentPassword: Joi.string().min(8).max(50).required(),
            newPassword: Joi.string().min(8).max(50).required()
        }).required()
    }
};
