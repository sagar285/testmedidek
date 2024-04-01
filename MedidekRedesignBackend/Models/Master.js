import mongoose from "mongoose";


const MasterShema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
        unique: true,
    },
    nameOfhospitalOrClinic: { type: String },
    hospitalType: { type: String, },
    location: { type: String },
    landmark: { type: String },
    enterFullAddress: { type: String },
    img: { type: String, default: "6d27d5a62d61ead2a0084c78fb31307afd5fed6e9e42c49feb9efdbf03423061" },
    role: { type: String, default: "MASTER" },
    createddate: { type: Date, default: Date.now() },
    imgurl: {
        type: String,
        default: "https://d26dtlo3dcke63.cloudfront.net/67c30e16c91a42ff9f30f84959a0ce1be155b24d8bbe14583d51cbfcc430fdba"
    },
    mapLink: {
        type: String
    },
    createddate: { type: Date, default: new Date() },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],

}, { timestamps: true })


const Master = mongoose.model("Master", MasterShema)

export { Master }



