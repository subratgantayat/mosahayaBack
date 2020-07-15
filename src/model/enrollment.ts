import {model, Schema} from 'mongoose';
import KeyvalueConfig from '../config/keyvalueConfig';
import CityConfig from '../config/cityConfig';
const schema: Schema = new Schema(
    {
        enrollmentId:{
            type: String,
            unique: true,
            index: true,
            required: true,
            minlength:16,
            maxlength:16,
            match:/^[0-9]{16}$/
        },
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
                maxlength:1000,
                match:/^\b(?!.*?\s{2})[A-Za-z ]{1,50}\b$/
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
                maxlength:100000,
                match:/^[\x20-\x7E\x0D\x0A]+$/
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
                maxlength:10000,
                match:/^[a-zA-Z0-9 ,.'-]+$/
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
                maxlength:10000,
                match:/^[\x20-\x7E]+$/
            },
            experience: {
                expYear: {
                    type: Number,
                    min:0,
                    max:150
                },
                expMonth: {
                    type: Number,
                    min:0,
                    max:11
                }
            },
            education:{
                type: String,
                required: true,
                enum: KeyvalueConfig.getValueArray('education')
            },
            preferredLocations:{
                type: [String],
                required: true,
                enum: CityConfig.getCityArray()
            },
            preferredLocationsOther:{
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
            }
        }
    },
    {timestamps: true}
);
schema.index({createdAt: 1});
export default model('enrollment', schema);
