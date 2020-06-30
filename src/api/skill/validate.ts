import * as Joi from '@hapi/joi';

export default {
    findall: {
        query: Joi.object().keys({
            'g-recaptcha-response':Joi.string().required().trim().min(1).max(10000)
        }).required()
    }
};
