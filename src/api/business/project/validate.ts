import * as Joi from '@hapi/joi';
import KeyvalueConfig from '../../../config/keyvalueConfig';
import BusinessKeyValue from '../../../config/businessKeyValue';
import Config from '../../../config/config';
import * as JoiObjectId from 'joi-objectid';

const JoiObjectIdInstance: any = JoiObjectId(Joi);

class Validate {
    private project: any = Joi.object().required().keys({
        title: Joi.string().required().trim().min(1).max(1000).pattern(/^[a-z0-9]+([\sa-z0-9@&:'./()_-])*$/i),
        description: Joi.string().trim().min(1).max(100000).pattern(/^[\x20-\x7E\s]+$/),
        typeOfEmployer: Joi.string().required().valid(...BusinessKeyValue.getValueArray('typeOfEmployer')),
        natureOfProject: Joi.array().min(0).max(1000).items(Joi.string().required().trim().min(1).max(10000).pattern(/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i)),
        location: Joi.string().required().valid(...KeyvalueConfig.getAllDistrictArray()),
        sectors: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('skillsBySector'))),
        natureOfEmployment: Joi.object().required().keys({
            employmentType: Joi.string().required().valid(...BusinessKeyValue.getValueArray('employmentType')),
            durationInDays: Joi.number().when('employmentType', {
                is: 'contract',
                then: Joi.number().required().integer().min(1).max(3650),
                otherwise: Joi.forbidden()
            })
        }),
        requirements: Joi.array().required().min(0).max(1000).items(
            Joi.object().required().keys({
                skill: Joi.string().required().trim().valid(...KeyvalueConfig.getSkillArray()),
                details: Joi.array().required().min(0).max(1000).items(
                    Joi.object().required().keys({
                        skillLevel: Joi.string().required().trim().valid(...BusinessKeyValue.getValueArray('skillLevel')),
                        noOfPeople: Joi.number().required().integer().min(1).max(100000),
                        salaryPerMonth: Joi.object().required().keys({
                            minValue: Joi.number().required().integer().min(1).max(10000000),
                            maxValue: Joi.number().required().integer().min(Joi.ref('minValue')).max(100000000)
                        })
                    }).unknown(true)
                )
            }).unknown(true)
        ),
        facility: Joi.object().required().keys({
            accommodation: Joi.boolean(),
            transport: Joi.boolean(),
            canteen: Joi.boolean(),
            cookingArea: Joi.boolean(),
            medicalCheckup: Joi.boolean(),
            healthInsurance: Joi.boolean(),
            industrialSafetyGears: Joi.boolean(),
            quarantineFacility: Joi.boolean(),
            guaranteedMinPay: Joi.boolean(),
            overTime: Joi.boolean()
        })
    }).unknown(true);

    private contactDetails: any = Joi.object().keys({
        name: Joi.string().trim().min(1).max(1000).pattern(/^[a-z]([a-z,.'-]*)+(\s[a-z,.'-]+)*$/i),
        email: Joi.string().trim().email().min(5).max(100),
        phoneNumber: Joi.string().trim().length(10).pattern(/^[6-9]+[0-9]+$/),
        designation: Joi.string().trim().min(1).max(1000)
    });
    private calculatedFields: any = {
        noOfEmployeesCalculated: Joi.number().required().integer().min(1).max(1000000),
        maxSalaryCalculated: Joi.number().required().integer().min(1).max(1000000000)
    };

    public create: any = {
        input: {
            payload: this.project.append({
                contactDetails: this.contactDetails.required()
            })
        },
        output: {
            schema: Joi.object().required().keys({
                message: Joi.string().required(),
                project: this.project.append({
                    contactDetails: this.contactDetails.required(),
                    _id: Joi.any().required()
                }).append(this.calculatedFields)
            }),
            failAction: Config.failAction
        }
    };
    public findSelf = {
        query: Joi.object().keys({
            page: Joi.number().required().integer().min(0).max(500000),
            limit: Joi.number().required().integer().positive().min(1).max(1000),
            //  title[=]:Joi.string().trim().min(1).max(1000),
            locations: Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getAllDistrictArray())).single(),
            sort: Joi.string().valid('createdAt', 'noOfApplicationCalculated').default('noOfApplicationCalculated'),
            sortOrder: Joi.string().valid(...Config.sortOrder).default(Config.defaultSortOrder)
        })
    };
    public findOneSelf = {
        params: Joi.object().required().keys({
            id: JoiObjectIdInstance().required()
        })
    };
    public edit = {
        params: Joi.object().required().keys({
            id: JoiObjectIdInstance().required()
        }),
        payload: this.create.input.payload
    };
    public find = {
        query: Joi.object().keys({
            /*  filter:Joi.object().keys({
              }).required(),*/
            /* page: Joi.number().required().integer().min(0).max(500000),
             limit: Joi.number().required().integer().positive().min(1).max(1000),
             sectors: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('skillsBySector'))).single(),
             locations: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid( ...CityConfig.getCityArray())).single(),
             skills: Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getSkillArray())).single(),
             sort:Joi.string().valid('createdAt','noOfApplicationCalculated').default('noOfApplicationCalculated'),
             sortOrder: Joi.string().valid(...Config.sortOrder).default(Config.defaultSortOrder)
         */
        }).unknown(true)
    };
}

export default new Validate();
