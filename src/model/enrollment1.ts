import {model, Schema} from 'mongoose';
import KeyvalueConfig from '../config/keyvalueConfig';
const schema: Schema = new Schema(
    {
        enrollmentId:{
            type: String,
            unique: true,
            index: true,
            required: true,
            minlength:16,
            maxlength:16,
            select: false,
            match:/^[0-9]{16}$/
        },
        generalData: {
            registerBy:{
                type: String,
                trim: true,
                enum: KeyvalueConfig.getValueArray('registerBy'),
                required: true
            },
            name:{
                type: String,
                required: true,
                trim: true,
                minlength:1,
                maxlength:1000,
                match:/^[a-z]([a-z,.'-]*)+(\s[a-z,.'-]+)*$/i
            },
            gender:{
                type: String,
                trim: true,
                enum: KeyvalueConfig.getValueArray('gender'),
                required: true
            },
            age:{
                type: Number,
                required: true,
                min:14,
                max:80
            },
            mobileNumber:{
                type: String,
                required: true,
                trim: true,
                minlength:10,
                maxlength:10,
                select: false,
                match:/^[6-9]+[0-9]+$/
            },
            pinCode:{
                type: String,
                required: true,
                trim: true,
                minlength:6,
                maxlength:6,
                match:/^([1-9])([0-9]){5}$/
            },
            address:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:100000,
                match:/^[\x20-\x7E\s]+$/
            }
        },
        skillData:{
            sectors:{
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
            sectorsOther:{
                type: [
                    {
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:10000,
                        match:/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i
                    }
                ]
            },
            skills:{
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
            skillsOther:{
                type: [
                    {
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:10000,
                        match:/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i
                    }
                ]
            },
            experience: {
                expYear: {
                    type: Number,
                    min:0,
                    max:149
                },
                expMonth: {
                    type: Number,
                    min:0,
                    max:11
                }
            },
            experienceInMonth: {
                type: Number,
                min:0,
                max:1800
            },
            education:{
                type: String,
                trim: true,
                required: true,
                enum: KeyvalueConfig.getValueArray('education')
            },
            preferredLocations:{
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
            otherInfo:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:100000,
                match:/^[\x20-\x7E\s]+$/
            }
        },
        healthData:{
            currentCondition:{
                type: [
                    {
                        type: String,
                        trim: true,
                        required: true,
                        enum: KeyvalueConfig.getValueArray('currentCondition')
                    }
                ]
            },
            currentConditionOther:{
                type: [
                    {
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:10000,
                        match:/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i
                    }
                ]
            },
            symptoms:{
                type: [
                    {
                        type: String,
                        trim: true,
                        required: true,
                        enum: KeyvalueConfig.getValueArray('symptoms')
                    }
                ]
            },
            symptomsOther:{
                type: [
                    {
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:10000,
                        match:/^[a-z]+([\sa-z0-9@&:'./()_-])*$/i
                    }
                ]
            }
        }
    },
    {timestamps: true}
);
schema.index({createdAt: 1});
export default model('enrollment1', schema);
