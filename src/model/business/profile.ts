import {Schema} from 'mongoose';
import KeyvalueConfig from '../../config/keyvalueConfig';

const schema: Schema = new Schema(
    {
        /*   userId:
               {
                   type: Schema.Types.ObjectId,
                   ref: 'businessuser',
                   required: true,
                   unique: true
               },*/
        address: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100000,
            match: /^[\x20-\x7E\s]+$/
        },
        sectors: {
            type: [
                {
                    type: String,
                    trim: true,
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
        skills: {
            type: [
                {
                    type: String,
                    trim: true,
                    required: true,
                    enum: KeyvalueConfig.getSkillArray()
                }
            ],
            required: true,
            validate: v => Array.isArray(v) && v.length > 0
        },
        skillsOther: {
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
        yearOfExperience: {
            type: Number,
            require: true,
            min: 0,
            max: 1000
        },
        geographyOfOp: {
            type: [
                {
                    type: String,
                    trim: true,
                    required: true,
                    enum: KeyvalueConfig.getAllDistrictArray()
                }
            ],
            required: true,
            validate: v => Array.isArray(v) && v.length > 0
        },
        largestContract: {
            price: {
                type: Number,
                min: 0,
                max: 10000000000
            },
            manpowerEmployed: {
                type: Number,
                min: 0,
                max: 10000000000
            }
        },
        pointOfContact: {
            type: {
                name: {
                    type: String,
                    trim: true,
                    minlength: 1,
                    maxlength: 1000,
                    match: /^[a-z]([a-z,.'-]*)+(\s[a-z,.'-]+)*$/i
                },
                email: {
                    type: String,
                    trim: true,
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
        nameOfFounder: {
            type: String,
            trim: true,
            minlength: 1,
            maxlength: 1000,
            match: /^[a-z]([a-z,.'-]*)+(\s[a-z,.'-]+)*$/i
        },
        typeOfProjectManaged: {
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
        companyWorkedWith: {
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
        website: {
            type: String,
            trim: true,
            match: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
            minlength: 5,
            maxlength: 10000
        },
        compliance: {
            type: {
                labourContractorLicense: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                gstRegd: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                providentFund: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                esic: {
                    type: Boolean,
                    required: true,
                    default: false
                },
                gratuity: {
                    type: Boolean,
                    required: true,
                    default: false
                }
            },
            required: true
        },
        resources: {
            plantMachinery: {
                type: Number,
                min: 0,
                max: 100000
            },
            humanResources: {
                type: Number,
                min: 0,
                max: 1000000
            }
        }
    },
    {timestamps: true}
);

export default schema;
