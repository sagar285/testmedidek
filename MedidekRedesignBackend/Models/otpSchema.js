import mongoose from 'mongoose'
const otpSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true
    },
    otp:{
        type:Number,
        required:true,
    }
})

const Otp = mongoose.model('UserOtps',otpSchema);

export {Otp};