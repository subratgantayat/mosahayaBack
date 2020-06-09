import {model, Schema} from 'mongoose';
import KeyvalueConfig from '../config/keyvalueConfig';
import CityConfig from '../config/cityConfig';
const schema: Schema = new Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
            minlength:1,
            maxlength:1000
        },
        phoneNumber:{
            type: String,
            unique: true,
            index: true,
            required: true,
            trim: true,
            minlength:10,
            maxlength:10,
            match:/^[6-9]+[0-9]+$/
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 5000,
            select: false
        },
        scope: {
            type: String,
            enum: ['admin'],
            required: true,
            default: 'admin',
            select: false
        },
        active: {
            type: Boolean,
            required: true,
            default: true
        },
        password_changed_at: {
            type: Date,
            select: false
        }
    },
    {timestamps: true}
);

// registration.index({active: 1, start: 1});
export default model('admin', schema);
