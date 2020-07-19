import {model, Schema} from 'mongoose';
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
            type: [{
                type: String,
                enum: ['company','admin']
            }],
            required: true,
            default: ['company'],
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
export default model('admin', schema);
