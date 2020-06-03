import * as Joi from '@hapi/joi';
import KeyvalueConfig from '../../config/keyvalueConfig';

export default {
    create: {
        payload: Joi.object().keys({
            generalData:Joi.object().keys({
                registerBy:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('registerBy')),
                category:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('category')),
                categoryOther:Joi.string().trim().min(1).max(1000),
                name:Joi.string().required().trim().min(1).max(1000),
                dob:Joi.date().required().max('now'),
                gender:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('gender')),
                mobileNumber:Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
                aadhaarNumber:Joi.string().required().trim().length(12).pattern(/^\d{12}$/),
                noOfFamilyMember:Joi.number().required().integer().min(0).max(1000),
                presentAddress:Joi.object().keys({
                    country:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('country')),
                    state: Joi.string().required().valid((Joi.in('country', {
                        adjust: (value) => { return KeyvalueConfig.getStateArray(value);}
                    }))),
                    district: Joi.string().required().valid(Joi.in('..', {
                        adjust: (value) => {
                            return KeyvalueConfig.getDistrictArray(value.country, value.state);}
                    })),
                    postalCode:Joi.string().required().trim().length(6).pattern(/^([1-9])([0-9]){5}$/),
                    locality:Joi.string().required().trim().min(1).max(100000)
                }).required(),
                permanentAddress:Joi.object().keys({
                    country:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('country')),
                    state: Joi.string().required().valid((Joi.in('country', {
                        adjust: (value) => { return KeyvalueConfig.getStateArray(value);}
                    }))),
                    district: Joi.string().required().valid(Joi.in('..', {
                        adjust: (value) => {
                            return KeyvalueConfig.getDistrictArray(value.country, value.state);}
                    })),
                    postalCode:Joi.string().required().trim().length(6).pattern(/^([1-9])([0-9]){5}$/),
                    locality:Joi.string().required().trim().min(1).max(100000)
                }).required(),
                contactPerson:Joi.object().keys({
                    contactName:Joi.string().required().trim().min(0).max(1000),
                    contactMobNumber:Joi.string().required().trim().length(10).pattern(/^[6-9]+[0-9]+$/)
                }).required()
            }).required(),
            skillData:Joi.object().keys({
                skills:Joi.array().required().min(0).max(1000).items(Joi.string().valid( ...KeyvalueConfig.getValueArray('skills'))),
                skillsOther:Joi.string().trim().min(1).max(10000),
                sectors:Joi.array().required().min(0).max(1000).items(Joi.string().valid( ...KeyvalueConfig.getValueArray('sectors'))),
                sectorsOther:Joi.string().trim().min(1).max(10000),
                experience: Joi.object().keys({
                    expYear:Joi.number().integer().min(0).max(100),
                    expMonth:Joi.number().integer().min(0).max(11)
                }),
                education:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('education')),
                educationSpec:Joi.string().trim().min(1).max(1000000),
                povertyStatus:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('povertyStatus')),
                povertyStatusOther:Joi.string().trim().min(1).max(1000),
                socialStatus:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('socialStatus')),
                socialStatusOther:Joi.string().trim().min(1).max(1000),
                annualIncome:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('annualIncome')),
                training:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('training')),
                trainingOther:Joi.string().trim().min(1).max(1000),
                trainingSpec:Joi.string().trim().min(1).max(1000000)
            }).required(),
            workHistory: Joi.array().min(0).max(1000).items(
                Joi.object().keys({
                    startDate:Joi.date().required(),
                    endDate:Joi.date().required().min(Joi.ref('startDate')).max('now'),
                    profile:Joi.string().required().trim().min(1).max(100000),
                    employer:Joi.string().required().trim().min(1).max(100000),
                    workSector:Joi.string().required().valid( ...KeyvalueConfig.getValueArray('sectors')),
                    workSectorOther:Joi.string().trim().min(1).max(1000),
                    contactDetails:Joi.string().required().trim().min(1).max(100000),
                    reference:Joi.string().required().trim().min(1).max(100000)
                })
            ),
            healthData:Joi.object().keys({
                currentCondition:Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('currentCondition'))),
                currentConditionOther:Joi.string().trim().min(1).max(10000),
                symptoms:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('symptoms'))),
                symptomsOther:Joi.string().trim().min(1).max(10000),
                goodHabits:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('goodHabits'))),
                goodHabitsOther:Joi.string().trim().min(1).max(10000),
                badHabits:Joi.array().min(0).max(1000).items(Joi.string().required().valid( ...KeyvalueConfig.getValueArray('badHabits'))),
                badHabitsOther:Joi.string().trim().min(1).max(10000),
                otherClinicalData:Joi.string().trim().min(1).max(100000),
                isContactWithPatient: Joi.boolean(),
                isLargeGather: Joi.boolean(),
                workingPublic: Joi.boolean(),
                isFContactWithPatient: Joi.boolean(),
                isFLargeGather: Joi.boolean(),
                workingFPublic: Joi.boolean(),
                hasToilet: Joi.boolean(),
                doingSanitize: Joi.boolean()
            }),
            travelHistory: Joi.array().min(0).max(1000).items(
                Joi.object().keys({
                    source:Joi.string().required().trim().min(1).max(100000),
                    travelStartDate:Joi.date().required().max('now'),
                    destination: Joi.string().required().trim().min(1).max(100000),
                    travelEndDate:Joi.date().required().min(Joi.ref('travelStartDate')).max('now'),
                    modeOfTravel: Joi.string().required().valid( ...KeyvalueConfig.getValueArray('modeOfTravel')),
                    modeOfTravelOther:Joi.string().trim().min(1).max(1000),
                    noOfPassenger:Joi.number().required().integer().min(0).max(100000)
                })
            ),
            feedback:Joi.object().keys({
                similarIndustry:Joi.string().trim().min(1).max(100000),
                migrationReason:Joi.string().trim().min(1).max(100000),
                minIncome:Joi.number().integer().min(0).max(1000000),
                otherInfo:Joi.string().trim().min(1).max(100000)
            })
        }).required()
    },
    viewForm: {
        query: Joi.object().keys({
            dob:Joi.date().required().iso().max('now')
        }).required(),
        params: Joi.object({
            id: Joi.string().required().trim().min(1).max(100)
        }).required()
    }
};
