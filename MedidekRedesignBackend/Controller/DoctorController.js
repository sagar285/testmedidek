import { Doctor } from "../Models/AddDoctors.js";
import { error, success } from "../Utils/responseWrapper.js";
import { uploadFile, getObjectSignedUrl } from '../Middleware/s3.js';
import crypto from "crypto";

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");




const editDoctorfile = async (req, res) => {
  const { id } = req.params;
  const {
    nameOfTheDoctor,
    qulification,
    speciality,
    yearOfExprience,
    connsultationFee,
    category1,
    category2,
    category3,
    category4,
    description,
    email,
    phone,
    acceptAppointments,
    imgurl,
    location
  } = req.body
  const file = req.file


  if (!nameOfTheDoctor || !qulification || !speciality
    || !yearOfExprience || !connsultationFee || !email || !phone || !acceptAppointments || !location
  ) {
    return res.send(error(500, { msg: "pls filled all field" }));
  }
  const imageName = file ? generateFileName() : imgurl;
  const fileBuffer = file?.buffer;

  try {
    if (fileBuffer) {
      await uploadFile(fileBuffer, imageName, file.mimetype)
    }
    const data = await Doctor.findByIdAndUpdate({ _id: id }, {
      nameOfTheDoctor,
      qulification,
      speciality,
      yearOfExprience,
      connsultationFee,
      img: imageName,
      category1,
      category2,
      category3,
      category4,
      description,
      email,
      phone,
      acceptAppointments,
      location
    }, { new: true });
    data.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + data.img
    await data.save();
    res.send(success(200, data));

  } catch (e) {
    res.send(error(500, e.message));
  }
}


const multipleloginprofile = async (req, res) => {
  const { doctorid } = req.params;
  if (!doctorid) {
    return res.send(error(400, "Pls give doctor id"));
  }
  try {
    const alldocts = await Doctor.find({$and:[{doctorid:doctorid,status:'ACTIVE'}]}).populate("hospitalId")
    for (let doctor of alldocts) {
      doctor.imgurl = "https://d26dtlo3dcke63.cloudfront.net/" + doctor.img
    }
    return res.send(success(200, alldocts));
  } catch (e) {
    return res.send(error(500, e.message))
  }

}

const acceptAppointmentBySlotEditController = async (req, res) => {
  const { id } = req.params
  const { acceptAppointmentBySlot } = req.body

  try {
    const doctor = await Doctor.findByIdAndUpdate({ _id: id }, { acceptAppointmentBySlot }, { new: true })

    return res.send(success(200, doctor))

  } catch (e) {
    return res.send(error(500, e.message))
  }

}
const acceptAppointmentByTokenEditController = async (req, res) => {
  const { id } = req.params
  const { acceptAppointmentByToken } = req.body

  try {
    const doctor = await Doctor.findByIdAndUpdate({ _id: id }, { acceptAppointmentByToken }, { new: true })

    return res.send(success(200, doctor))

  } catch (e) {
    return res.send(error(500, e.message))
  }

}

const getAllDoctorWithAllQuery = async (req, res) => {

  // const nameOfTheDoctor = req.query.nameOfTheDoctor || ""
  // const speciality = req.query.speciality || ""
  // const location = req.query.location || ""
  // const landmark = req.query.landmark || ""
  // const enterFullAddress = req.query.landmark || ""

  try {

    const userInput = req.query.userInput ? req.query.userInput : "" ;
    // const page =req.query.page;
    // const perpage =20

    // Use the user input to search the database in all specified keys
    const doctors = await Doctor.find({
      $or: [
        { nameOfTheDoctor: new RegExp(userInput, 'i') },
        { speciality: new RegExp(userInput, 'i') },
        { location: new RegExp(userInput, 'i') },
        { landmark: new RegExp(userInput, 'i') },
        // { connsultationFee: new RegExp(userInput, 'i') }
      ]
    }).limit(20);

    return res.send(success(200, doctors));

  } catch (e) {
    res.send(error(500, e.message));
  }

};

const getDoctorWithSpeciality = async (req, res) => {

  const speciality = req.query.speciality || "";

  // const query = {
  //   speciality: { $regex: search, $options: "i" }
  //         }
  try {

    const doctors = await Doctor.find({
      speciality: { $regex: speciality, $options: "i" }
    });

    return res.send(success(200, doctors));

  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getSpeacilityList = async (req, res) => {

  const {speciality,page} = req.query;
  const perpage =20;

  try {
    
  const specialityList =  await Doctor.find({speciality: { $regex: speciality, $options: 'i' }}).distinct('speciality').skip(page*perpage).limit(20)

  return res.send(success(200, specialityList));
  } catch (e) {
    return res.send(error(500, e.message));
  }

  
};

// const getAllDoctorWithSpecificQuery = async (req, res) => {

//   // const nameOfTheDoctor = req.query.nameOfTheDoctor || ""
//   // const speciality = req.query.speciality || ""
//   // const location = req.query.location || ""
//   // const landmark = req.query.landmark || ""
//   // const enterFullAddress = req.query.landmark || ""

//   try {
//     const userInput = req.query.userInput;

//     // Use the user input to search the database in all specified keys
//     // const doctors = await Doctor.find({
//     //   $or: [
//     //     { nameOfTheDoctor: new RegExp(userInput, 'i') },
//     //     { speciality: new RegExp(userInput, 'i') },
//     //     { location: new RegExp(userInput, 'i') },
//     //     { landmark: new RegExp(userInput, 'i') },
//     //     // { connsultationFee: new RegExp(userInput, 'i') }
//     //   ]
//     // });

//     // export const getAllUsers = async (req, res) => {
//       console.log(req.query);
//       const speciality = req.query.speciality || ""
//       const gender = req.query.gender || ""
//       const status = req.query.status || ""
//       const sort = req.query.sort || ""
//       const page = req.query.page || 1
//       const ITEM_PER_PAGE = 4;

//       const query = {
//           fname: { $regex: search, $options: "i" }
//       }

//       if (gender !== "All") {
//           query.gender = gender
//       }

//       if (status !== "All") {
//           query.status = status
//       }

//       try {

//           const skip = (page - 1) * ITEM_PER_PAGE
//           const count = await User.countDocuments(query)


//           const users = await User.find(query)
//               .sort({ datecreated: sort == "new" ? -1 : 1 })
//               .limit(ITEM_PER_PAGE)
//               .skip(skip)

//               const pageCount = Math.ceil(count/ITEM_PER_PAGE)


//           res.status(200).json({
//               Pagination:{
//                   count, pageCount
//               },
//               users})
//       } catch (error) {
//           res.status(401).json(error)
//           console.log("Error While getting users data");
//       }
//   // }

//     return res.send(success(200, doctors));

//   } catch (e) {
//     res.send(error(500, e.message));
//   }

// };





export { editDoctorfile, multipleloginprofile, acceptAppointmentBySlotEditController, acceptAppointmentByTokenEditController, getAllDoctorWithAllQuery, getDoctorWithSpeciality, getSpeacilityList }

