import Router from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
  addAvailability,
  bookAppointment,
  cancelAppointment,
  getAllAvailability,
  getAvailability,
  getAppointments,
  removeAvailability,
} from "../controllers/appointment.controller.js"

const router = Router()

router.route("/availability/:id/:slotDate").get(getAvailability)
router.route("/availability").get(getAllAvailability)

// Secured Routes
router.route("/availability").post(verifyJwt, addAvailability)
router.route("/availability").delete(verifyJwt, removeAvailability)
router.route("/").post(verifyJwt, bookAppointment)
router.route("/").patch(verifyJwt, cancelAppointment)
router.route("/").get(verifyJwt, getAppointments)

export default router
