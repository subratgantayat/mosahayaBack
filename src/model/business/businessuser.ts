import {model, Schema} from 'mongoose';
import Profile from './profile';
const schema: Schema = new Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
            minlength:1,
            maxlength:1000,
            match:/^[a-z0-9]+([\sa-z0-9@&:'./()_-])*$/i
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            minlength: 5,
            maxlength: 100,
            match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        },
        emailVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 5000,
            select: false
        },
        phoneNumber:{
            type: String,
            trim: true,
            minlength:10,
            maxlength:10,
            match:/^[6-9]+[0-9]+$/
        },
        scope: {
            type: [{
                type: String,
                trim: true,
                enum: ['business','admin']
            }],
            required: true,
            default: ['business'],
            select: false
        },
        active: {
            type: Boolean,
            required: true,
            default: true
        },
        profile:{
            type: Profile
        },
        password_changed_at: {
            type: Date,
            select: false
        }
    },
    {timestamps: true}
);
// schema.index({'profile.sectors': 1, 'profile.geographyOfOp': 1});
export default model('businessuser', schema);
