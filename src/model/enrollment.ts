import {model, Schema} from 'mongoose';
import KeyvalueConfig from '../config/keyvalueConfig';

const schema: Schema = new Schema(
    {
        generalData: {
            registerBy:{
                type: String,
                enum: KeyvalueConfig.getValueArray('registerBy'),
                required: true
            },
            name:{
                type: String,
                required: true,
                trim: true,
                minlength:1,
                maxlength:1000
            },
            gender:{
                type: String,
                enum: KeyvalueConfig.getValueArray('gender'),
                required: true
            },
            age:{
                type: Number,
                required: true,
                min:1,
                max:150
            },
            mobileNumber:{
                type: String,
                required: true,
                trim: true,
                minlength:10,
                maxlength:10,
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
                maxlength:100000
            }
        },
        skillData:{
            skills:{
                type: [String],
                required: true,
                enum: KeyvalueConfig.getValueArray('skills')
            },
            skillsOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:10000
            },
            sectors:{
                type: [String],
                required: true,
                enum: KeyvalueConfig.getValueArray('sectors')
            },
            sectorsOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:10000
            },
            experience: {
                type: Number,
                min:0,
                max:150
            },
            education:{
                type: String,
                required: true,
                enum: KeyvalueConfig.getValueArray('education')
            },
            preferredLocation:{
                type: String,
                required: true
            }
        },
        healthData:{
            currentCondition:{
                type: [String],
                enum: KeyvalueConfig.getValueArray('currentCondition')
            },
            currentConditionOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:10000
            },
            symptoms:{
                type: [String],
                enum: KeyvalueConfig.getValueArray('symptoms')
            },
            symptomsOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:10000
            },
            otherInfo:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:100000
            }
        }
    },
    {timestamps: true}
);

// registration.index({active: 1, start: 1});
export default model('enrollment', schema);
