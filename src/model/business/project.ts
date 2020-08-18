import {model, Schema} from 'mongoose';
import KeyvalueConfig from '../../config/keyvalueConfig';
import BusinessKeyValue from '../../config/businessKeyValue';
import Config from '../../config/config';

const schema: Schema = new Schema(
    {
        userId:
            {
                type: Schema.Types.ObjectId,
                ref: 'businessuser',
                required: true,
                index: true
            },
        active: {
            type: Boolean,
            required: true,
            default: true
        },
        title: {
            type: String,
            trim: true,
            required: true,
            minlength:1,
            maxlength:1000,
            match:/^[a-z0-9]+([\sa-z0-9@&:'./()_-])*$/i
        },
        description: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 100000,
            match: /^[\x20-\x7E\s]+$/
        },
        typeOfEmployer: {
            type: String,
            trim: true,
            required: true,
            enum: BusinessKeyValue.getValueArray('typeOfEmployer')
        },
        natureOfProject: {
            type: [
                {
                    type: String,
                    required: true,
                    trim: true,
                    minlength: 1,
                    maxlength: 10000,
                    match: /^[a-z]+([\sa-z0-9@&:'./()_-])*$/i
                }
            ]
        },
        location: {
            type: String,
            trim: true,
            required: true,
            enum: KeyvalueConfig.getAllDistrictArray()
        },
        contactDetails: {
            type:{
                name: {
                    type: String,
                    trim: true,
                    minlength: 1,
                    maxlength: 1000,
                    match: /^[a-z]([a-z,.'-]*)+(\s[a-z,.'-]+)*$/i
                },
                email: {
                    type: String,
                    minlength: 5,
                    maxlength: 100,
                    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                },
                phoneNumber: {
                    type: String,
                    trim: true,
                    minlength: 10,
                    maxlength: 10,
                    match: /^[6-9]+[0-9]+$/
                },
                designation: {
                    type: String,
                    trim: true,
                    minlength: 1,
                    maxlength: 1000
                }
            },
            required: true,
            select: false
        },
        sectors: {
            type: [
                {
                    type: String,
                    required: true,
                    enum: KeyvalueConfig.getValueArray('skillsBySector')
                }
            ],
            required: true,
            validate: v => Array.isArray(v) && v.length > 0
        },
        sectorsOther: {
            type: [
                {
                    type: String,
                    required: true,
                    trim: true,
                    minlength: 1,
                    maxlength: 10000,
                    match: /^[a-z]+([\sa-z0-9@&:'./()_-])*$/i
                }
            ]
        },
        requirements: {
            type: [
                {
                    skill: {
                        type: String,
                        required: true,
                        enum: KeyvalueConfig.getSkillArray()
                    },
                    skillOther: {
                        type: String,
                        trim: true,
                        minlength: 1,
                        maxlength: 10000,
                        match: /^[a-z]+([\sa-z0-9@&:'./()_-])*$/i
                    },
                    details: {
                        type: [
                            {
                                skillLevel: {
                                    type: String,
                                    required: true,
                                    enum: BusinessKeyValue.getValueArray('skillLevel')
                                },
                                noOfPeople: {
                                    type: Number,
                                    required: true,
                                    min: 1,
                                    max: 100000
                                },
                                salaryPerMonth: {
                                    type:{
                                        minValue: {
                                            type: Number,
                                            required: true,
                                            min: 1,
                                            max: 10000000
                                        },
                                        maxValue: {
                                            type: Number,
                                            required: true,
                                            validate (v) {
                                                return v>=this.minValue;
                                            },
                                            max: 100000000
                                        }
                                    },
                                    required: true
                                }
                            }
                        ],
                        required: true,
                        validate: v => Array.isArray(v) && v.length > 0
                    }
                }
            ],
            required: true,
            validate: v => Array.isArray(v) && v.length > 0
        },
        noOfEmployeesCalculated:{
            type: Number,
            required: true,
            min:1,
            max: 1000000
        },
        maxSalaryCalculated:{
            type: Number,
            required: true,
            min:1,
            max: 1000000000
        },
        natureOfEmployment:{
          type:{
              employmentType:{
                  type: String,
                  required: true,
                  trim: true,
                  enum:BusinessKeyValue.getValueArray('employmentType')
              },
              durationInDays:{
                  type: Number,
                  required() {
                      return this.employmentType === 'contract';
                  },
                  min:1,
                  max: 3650
              }
          },
            required: true
        },
        facility: {
            accommodation: {
                type: Boolean
            },
            transport: {
                type: Boolean
            },
            canteen: {
                type: Boolean
            },
            cookingArea: {
                type: Boolean
            },
            medicalCheckup: {
                type: Boolean
            },
            healthInsurance: {
                type: Boolean
            },
            industrialSafetyGears: {
                type: Boolean
            },
            quarantineFacility: {
                type: Boolean
            },
            guaranteedMinPay: {
                type: Boolean
            },
            overTime: {
                type: Boolean
            }
        },
        noOfApplicationCalculated:{
            type: Number,
            required: true,
            min:0,
            max: 10000000,
            default:0
        },
        applications: {
            type: [
                {
                    user: {
                        type: Schema.Types.ObjectId,
                        ref: 'businessuser',
                        required: true
                    },
                    status: {
                        type: String,
                        trim: true,
                        required: true,
                        enum: BusinessKeyValue.getValueArray('applicationStatus'),
                        default:Config.defaultProjectApplicationStatus
                    },
                    appliedOn:{
                        type: Date,
                        required: true
                    }
                }
            ],
            select: false
        }
    },
    {timestamps: true}
);
schema.index({userId: 1, title: 1}, {unique: true});
schema.index( { 'applications.user': 1});
// schema.index( { title: 'text'});
// schema.index({location: 1, title: 1});
export default model('project', schema);
