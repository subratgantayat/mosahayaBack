import {model, Schema} from 'mongoose';
const schema: Schema = new Schema(
    {
        a:{
            type: String,
            required: true,
            trim: true,
            minlength:1,
            maxlength:1000
        },
        c:{
            type: Number,
            required: true
        },
        b:{
            type: Number,
            required: true,
            validate (v) {
                return v>=this.c;
            }
        }
    },
    {timestamps: true}
);
export default model('test1', schema);
