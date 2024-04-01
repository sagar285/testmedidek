import moment from "moment";
import { Doctor } from "../Models/AddDoctors.js";
import { Tokens } from "../Models/Token.js";
import { AppointmentTokenModel } from "../Models/tokencreate.js";
import { success, error } from "../Utils/responseWrapper.js";
const createToken = async (req, res) => {
    const { // doctorid should be database id of doctor
        Starttime1,
        Endtime1,
        Starttime2,
        Endtime2,
        Starttime3,
        Endtime3,
        date,
        doctorid,
        appointmentByToken
    } = req.body;
    const newdate = new Date(date);

    try {
        const isslotalready = await Tokens.findOne({ $and: [{ doctor_id: doctorid }, { date: newdate }] });
        if (isslotalready) {
            const updatedslot = await Tokens.findOneAndUpdate({ $and: [{ doctor_id: doctorid }, { date: newdate }] }, {
                Starttime1,
                Endtime1,
                Starttime2,
                Endtime2,
                Starttime3,
                Endtime3,
                date: newdate,
                doctor_id: doctorid
            }, { new: true })


            return res.send(success(200, { update: updatedslot }));
        }
        const createdslot = await Tokens.create({
            Starttime1,
            Endtime1,
            Starttime2,
            Endtime2,
            Starttime3,
            Endtime3,
            date: newdate,
            doctor_id: doctorid
        })
        return res.send(success(200, { create: createdslot }));
    } catch (e) {
        return res.send(error(e.messege));
    }

}


const getTokenData = async (req, res) => {
    const { doctorid, date } = req.params;
    const newDate = new Date(date)
    if (!doctorid || !date) {
        return res.send(error(400, "pls filled all field"));
    }
    try {
        const data = await Tokens.findOne({
            $and: [{ doctor_id: doctorid }, { date: newDate }],
        });
        console.log(data)
        return res.send(success(200, data));
    } catch (e) {
        return res.send(error(500, e.messege));
    }
};

const bookappointmentbytoken = async (req, res) => {
    const {
        doctorid,
        userid,
        name,
        age,
        gender,
        phone,
        AppointmentNotes,
        appointmentDate,
        role
    } = req.body;
    const today = new Date(appointmentDate);
    const lastAppointment = await AppointmentTokenModel.
        findOne({ doctorid, appointmentDate: { $gte: today } })
        .sort({ tokenNo: -1 });
    let nextTokenNo = lastAppointment ? lastAppointment.tokenNo + 1 : 1;
    if (role === "MASTER") {
        const newToken = await AppointmentTokenModel.create({
            doctorid,
            hospitalid: userid,
            name,
            age,
            gender,
            phone,
            AppointmentNotes,
            appointmentDate: today,
            tokenid: Math.random().toString(36).substring(7),
            tokenNo: nextTokenNo,
        });
        return res.send(success(201,
            newToken));
    }


    const existingToken = await AppointmentTokenModel.findOne({
        doctorid,
        userid: userid,
        appointmentDate: { $gte: today },
        status: "pending"
    });
    if (existingToken) {
        // The doctor has already created a token for the patient for the current day.
        return res.send(error(409, "token already exist for this user and doctor for today"
        ));
    }
    // Create a new token
    const newToken = await AppointmentTokenModel.create({
        doctorid,
        userid,
        name,
        age,
        gender,
        phone,
        AppointmentNotes,
        appointmentDate: today,
        tokenid: Math.random().toString(36).substring(7),
        tokenNo: nextTokenNo,
    });
    return res.send(success(201,
        newToken));
}




const scheduleappointmentfordoctor =async(req,res)=>{

    // const alldoctors = await Doctor.find({});

    // for(let i =0; i<alldoctors.length; i++){
     
    //     const id = alldoctors[i]?._id;
    //     const currentDate = moment();
    //     for(i=0;i<90;i++){
    //         const date =currentDate.clone().add(i, 'days')
    //         const newdate = new Date(date);
    //         const data = await Tokens.create({
    //             doctor_id:id,
    //             date:newdate,
    //             Starttime1:"07:00",
    //             Endtime1:"09:00",
    //             Starttime2:"11:00",
    //             Endtime2:"13:00",
    //             Starttime3:"15:00",
    //             Endtime3:'17:00',
    //         }) 
    //         console.log(data);
    //         console.log(i);
    //     }
       
    // }

    const tokens = await Tokens.find({});
     return res.status(200).send({tokens:tokens.length});
}




export { createToken, getTokenData, bookappointmentbytoken,scheduleappointmentfordoctor };