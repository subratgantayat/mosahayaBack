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
            category:{
                type: String,
                enum: KeyvalueConfig.getValueArray('category'),
                required: true
            },
            categoryOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:1000
            },
            name:{
                type: String,
                required: true,
                trim: true,
                minlength:1,
                maxlength:1000
            },
            dob:{
                type: Date,
                required: true,
                max() {
                    return new Date();
                }
            },
            gender:{
                type: String,
                enum: KeyvalueConfig.getValueArray('gender'),
                required: true
            },
            mobileNumber:{
                type: String,
                required: true,
                trim: true,
                minlength:10,
                maxlength:10,
                match:/^[0-9]+$/
            },
            aadhaarNumber:{
                type: String,
                required: true,
                trim: true,
                minlength:12,
                maxlength:12,
                match:/^\d{12}$/
            },
            noOfFamilyMember:{
                type: Number,
                required: true,
                min:0,
                max:1000
            },
            presentAddress:{
                country:{
                    type: String,
                    required: true,
                    enum: KeyvalueConfig.getValueArray('country')
                },
                state:{
                    type: String,
                    required: true,
                    validate (v) {
                        return KeyvalueConfig.getStateArray(this.generalData.presentAddress.country).includes(v);
                    }
                },
                district:{
                    type: String,
                    required: true,
                    validate (v) {
                        return KeyvalueConfig.getDistrictArray(this.generalData.presentAddress.country, this.generalData.presentAddress.state ).includes(v);
                    }
                },
                postalCode:{
                    type: String,
                    required: true,
                    trim: true,
                    minlength:6,
                    maxlength:6,
                    match:/^([1-9])([0-9]){5}$/
                },
                locality:{
                    type: String,
                    required: true,
                    trim: true,
                    minlength:1,
                    maxlength:100000
                }
            },
            permanentAddress:{
                country:{
                    type: String,
                    required: true,
                    enum: KeyvalueConfig.getValueArray('country')
                },
                state:{
                    type: String,
                    required: true,
                    validate (v) {
                        return KeyvalueConfig.getStateArray(this.generalData.presentAddress.country).includes(v);
                    }
                },
                district:{
                    type: String,
                    required: true,
                    validate (v) {
                        return KeyvalueConfig.getDistrictArray(this.generalData.presentAddress.country, this.generalData.presentAddress.state ).includes(v);
                    }
                },
                postalCode:{
                    type: String,
                    required: true,
                    trim: true,
                    minlength:6,
                    maxlength:6,
                    match:/^([1-9])([0-9]){5}$/
                },
                locality:{
                    type: String,
                    trim: true,
                    required: true,
                    minlength:1,
                    maxlength:100000
                }
            },
            contactPerson:{
                contactName:{
                    type: String,
                    required: true,
                    trim: true,
                    minlength:1,
                    maxlength:1000
                },
                contactMobNumber:{
                    type: String,
                    required: true,
                    trim: true,
                    minlength:10,
                    maxlength:10,
                    match:/^[0-9]+$/
                }
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
                expYear: {
                    type: Number,
                    min:0,
                    max:100
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
            educationSpec:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:1000000
            },
            povertyStatus:{
                type: String,
                required: true,
                enum: KeyvalueConfig.getValueArray('povertyStatus')
            },
            povertyStatusOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:1000
            },
            socialStatus:{
                type: String,
                required: true,
                enum: KeyvalueConfig.getValueArray('socialStatus')
            },
            socialStatusOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:1000
            },
            annualIncome:{
                type: String,
                required: true,
                enum: KeyvalueConfig.getValueArray('annualIncome')
            },
            training:{
                type: String,
                required: true,
                enum: KeyvalueConfig.getValueArray('training')
            },
            trainingOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:1000
            },
            trainingSpec:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:1000000
            }
        },
        workHistory:{
            type: [
                {
                    startDate:{
                        type: Date,
                        required: true
                    },
                    endDate:{
                        type: Date,
                        required: true,
                        min() {
                            return new Date(this.startDate);
                        },
                        max() {
                            return new Date();
                        }
                    },
                    profile:{
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:100000
                    },
                    employer:{
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:100000
                    },
                    workSector:{
                        type: String,
                        required: true,
                        enum: KeyvalueConfig.getValueArray('sectors')
                    },
                    workSectorOther:{
                        type: String,
                        trim: true,
                        minlength:1,
                        maxlength:1000
                    },
                    contactDetails:{
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:100000
                    },
                    reference:{
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:100000
                    }
                }
            ]
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
            goodHabits:{
                type: [String],
                enum: KeyvalueConfig.getValueArray('goodHabits')
            },
            goodHabitsOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:10000
            },
            badHabits:{
                type: [String],
                enum: KeyvalueConfig.getValueArray('badHabits')
            },
            badHabitsOther:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:10000
            },
            otherClinicalData:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:100000
            },
            isContactWithPatient:{
                type: Boolean
            },
            isLargeGather:{
                type: Boolean
            },
            workingPublic:{
                type: Boolean
            },
            isFContactWithPatient:{
                type: Boolean
            },
            isFLargeGather:{
                type: Boolean
            },
            workingFPublic:{
                type: Boolean
            },
            hasToilet:{
                type: Boolean
            },
            doingSanitize:{
                type: Boolean
            }
        },
        travelHistory:{
            type:[
                {
                    source:{
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:100000
                    },
                    travelStartDate:{
                        type: Date,
                        required: true
                    },
                    destination:{
                        type: String,
                        required: true,
                        trim: true,
                        minlength:1,
                        maxlength:100000
                    },
                    travelEndDate:{
                        type: Date,
                        required: true,
                        min() {
                            return new Date(this.travelStartDate);
                        },
                        max() {
                            return new Date();
                        }
                    },
                    modeOfTravel:{
                        type: String,
                        required: true,
                        enum: KeyvalueConfig.getValueArray('modeOfTravel')
                    },
                    modeOfTravelOther:{
                        type: String,
                        trim: true,
                        minlength:1,
                        maxlength:1000
                    },
                    noOfPassenger:{
                        type: Number,
                        required: true,
                        min:0,
                        max:100000
                    }
                }
            ]
        },
        feedback:{
            similarIndustry:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:100000
            },
            migrationReason:{
                type: String,
                trim: true,
                minlength:1,
                maxlength:100000
            },
            minIncome:{
                type: Number,
                min:0,
                max:1000000
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
export default model('registration', schema);
