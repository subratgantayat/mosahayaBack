import * as Joi from '@hapi/joi';
import KeyvalueConfig from '../../../config/keyvalueConfig';
import BusinessKeyValue from '../../../config/businessKeyValue';
import Config from '../../../config/config';
import * as JoiObjectId from 'joi-objectid';

const JoiObjectIdInstance: any = JoiObjectId(Joi);

class Validate {
    private project: any = Joi.object().keys({
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

    private application: any = Joi.object().keys({
        user: Joi.any().required(),
        status: Joi.string().required().valid(...BusinessKeyValue.getValueArray('applicationStatus')),
        appliedOn: Joi.date().required().max('now')
    }).unknown(true);

    private calculatedFields: any = {
        active: Joi.boolean().required(),
        _id: Joi.any().required(),
        userId: Joi.any().required(),
        applications: Joi.array().min(0).max(100000000).items(
            this.application
        )
    };
    private privateProject: any = this.project.append({
        contactDetails: this.contactDetails
    }).append(this.calculatedFields);

    private fullProject: any = this.project.append({
        contactDetails: this.contactDetails.required()
    }).append(this.calculatedFields).append(
        {
            noOfEmployeesCalculated: Joi.number().required().integer().min(1).max(1000000),
            maxSalaryCalculated: Joi.number().required().integer().min(1).max(1000000000),
            noOfApplicationCalculated: Joi.number().required().integer().min(0).max(10000000)
        }
    );

    private projectOutput: any = {
        schema: Joi.object().required().keys({
            message: Joi.string().required(),
            project: this.fullProject.required()
        }),
        failAction: Config.failAction
    };

    public create: any = {
        input: {
            payload: this.project.required().append({
                contactDetails: this.contactDetails.required()
            })
        },
        output: this.projectOutput
    };
    public findSelf: any = {
        input: {
            query: Joi.object().required().keys({
                page: Joi.number().required().integer().min(0).max(500000),
                limit: Joi.number().required().integer().positive().min(1).max(1000),
                active: Joi.string().trim().valid('all', 'y', 'n').default('y'),
                title: Joi.string().trim().min(1).max(1000),
                location: Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getAllDistrictArray())).single(),
                sort: Joi.string().valid('createdAt', 'noOfApplicationCalculated').default('noOfApplicationCalculated'),
                sortOrder: Joi.string().valid(...Config.sortOrder).default(Config.defaultSortOrder)
            })
        },
        output: {
            schema: Joi.object().required().keys({
                message: Joi.string().required(),
                projects: Joi.array().required().min(0).max(1000).items(
                    this.fullProject
                ),
                count: Joi.number().required().integer().min(0).max(1000)
            }),
            failAction: Config.failAction
        }
    };
    public findOneSelf: any = {
        input: {
            params: Joi.object().required().keys({
                id: JoiObjectIdInstance().required()
            })
        },
        output: {
            schema: Joi.object().required().keys({
                message: Joi.string().required(),
                project: this.fullProject
            }),
            failAction: Config.failAction
        }
    };
    public edit: any = {
        input: {
            params: Joi.object().required().keys({
                id: JoiObjectIdInstance().required()
            }),
            payload: this.project.required().append({
                contactDetails: this.contactDetails.required()
            }).append({
                active: Joi.boolean().required()
            })
        },
        output: this.projectOutput
    };
    public find: any = {
        input: {
            query: Joi.object().required().keys({
                page: Joi.number().required().integer().min(0).max(500000),
                limit: Joi.number().required().integer().positive().min(1).max(1000),
                sectors: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getValueArray('skillsBySector'))).single(),
                location: Joi.array().required().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getAllDistrictArray())).single(),
                skills: Joi.array().min(0).max(1000).items(Joi.string().required().valid(...KeyvalueConfig.getSkillArray())).single(),
                employmentType: Joi.array().min(0).max(1000).items(Joi.string().required().valid(...BusinessKeyValue.getValueArray('employmentType'))).single(),
                expectedSalary: Joi.number().integer().min(0).max(100000000),
                accommodation: Joi.boolean(),
                transport: Joi.boolean(),
                canteen: Joi.boolean(),
                cookingArea: Joi.boolean(),
                medicalCheckup: Joi.boolean(),
                healthInsurance: Joi.boolean(),
                industrialSafetyGears: Joi.boolean(),
                quarantineFacility: Joi.boolean(),
                guaranteedMinPay: Joi.boolean(),
                overTime: Joi.boolean(),
                sort: Joi.string().valid('createdAt', 'noOfEmployeesCalculated').default('createdAt'),
                sortOrder: Joi.string().valid(...Config.sortOrder).default(Config.defaultSortOrder)
            })
        },
        output: {
            schema: Joi.object().required().keys({
                message: Joi.string().required(),
                projects: Joi.array().required().min(0).max(1000).items(
                    this.privateProject
                ),
                count: Joi.number().required().integer().min(0).max(1000)
            }),
            failAction: Config.failAction
        }
    };

    public findOne: any = {
        input: {
            params: Joi.object().required().keys({
                id: JoiObjectIdInstance().required()
            })
        },
        output: {
            schema: Joi.object().required().keys({
                message: Joi.string().required(),
                project: this.privateProject,
                application: this.application
            }),
            failAction: Config.failAction
        }
    };

    public applyProject: any = {
        input: {
            params: Joi.object().required().keys({
                id: JoiObjectIdInstance().required()
            })
        },
        output: {
            schema: Joi.object().required().keys({
                message: Joi.string().required()
            }),
            failAction: Config.failAction
        }
    };

    public getApplyProject: any = {
        output: {
            schema: Joi.object().required().keys({
                message: Joi.string().required(),
                projects: Joi.array().required().min(0).max(1000).items(
                    this.privateProject
                )
            }),
            failAction: Config.failAction
        }
    };
}

export default new Validate();
