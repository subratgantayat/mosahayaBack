import {model, Schema} from 'mongoose';
import KeyvalueConfig from '../config/keyvalueConfig';
const schema: Schema = new Schema(
    {
        name:{
            type: String,
            required: true,
            trim: true,
            minlength:1,
            maxlength:1000
        },
        state:{
            type: String,
            required: true,
            validate (v) {
                return KeyvalueConfig.getStateArray('india').includes(v);
            }
        },
        city:{
            type: String,
            trim: true,
            minlength:1,
            maxlength:10000
        },
        district:{
            type: String,
            trim: true,
            minlength:1,
            maxlength:10000
        },
        address:{
            type: String,
            trim: true,
            minlength:1,
            maxlength:100000
        },
        contactNo:{
            type: String,
            required: true,
            trim: true,
            minlength:10,
            maxlength:10,
            match:/^[6-9]+[0-9]+$/
        },
        skills:{
            type: [{
               name:{
                   type: String,
                   required: true,
                   trim: true,
                   minlength:1,
                   maxlength:10000
               },
                link:{
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'skills'
                },
                _id:false
            }],
            required: true
        },
        uploadRef:{
            type: String,
            required: true,
            trim: true,
            minlength:1,
            maxlength:10000
        }
    },
    {timestamps: true}
);

schema.index({skills: 1, updatedAt: 1});
schema.index( { name: 1, state:1, contactNo: 1 }, { unique: true } );
export default model('employee', schema);
