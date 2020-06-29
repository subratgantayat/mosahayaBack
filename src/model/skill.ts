import {model, Schema} from 'mongoose';
const schema: Schema = new Schema(
    {
        name:{
            type: String,
            unique: true,
            required: true,
            trim: true,
            minlength:1,
            maxlength:10000
        },
        uploadRef:{
            type: String,
            trim: true,
            minlength:1,
            maxlength:10000
        }
    },
    {timestamps: true}
);

export default model('skill', schema);
