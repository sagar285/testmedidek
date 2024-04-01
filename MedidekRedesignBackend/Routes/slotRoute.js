import express from "express"
const slotRouter = express.Router();
import { createslot, getslot, userslot } from "../Controller/slotController.js"

slotRouter.post("/creatSlotForDoctor", createslot);
slotRouter.get("/getSlotDetailForDoctorForPerticularDate/:doctorid/:date", getslot);
slotRouter.get("/getAvailbleSlotsForAnUser/:doctorid/:date", userslot);
// slotRouter.get("/slot", getslot);
// slotRouter.get("/userslot", userslot);

export { slotRouter }