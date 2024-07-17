import Availability from "../models/availability.model.js"
import Appointment from "../models/appointment.model.js"
import User from "../models/user.model.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const generateSlots = async (slots, advisorId) => {
  let generartedSlots = []

  slots.map((slot) => {
    const startTime = slot.startTime * 1000
    const endTime = slot.endTime * 1000
    const duration = slot.duration * 60 * 1000
    let currentTime = startTime
    while (currentTime + duration < endTime) {
      const newslot = {
        slotDate: new Date(currentTime).getDate(),
        startTime: new Date(currentTime),
        endTime: new Date(currentTime + duration),
        meetingDuration: duration,
        advisorId: advisorId,
        booked: false,
      }
      generartedSlots.push(newslot)
      currentTime += duration
    }
  })
  return generartedSlots
}

const addAvailability = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (user.role !== "advisor") throw new ApiError(401, "Unauthorized Request")
    const generartedSlots = await generateSlots(req.body.slots, req.user._id)
    const availabilties = await Availability.create(generartedSlots)
    return res
      .status(201)
      .json(
        new ApiResponse(200, availabilties, "Availabilites Added Successfully")
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Adding Availability")
  }
})

const removeAvailability = asyncHandler(async (req, res) => {
  try {
    if (req.body.slots.length === 0) {
      throw new ApiError(400, "No Slots Selected")
    }
    let slotsRemoved = []
    await Promise.all(
      req.body.slots.map(async (slot) => {
        const removedSlot = await Availability.findOneAndDelete({
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
          advisorId: req.user._id,
        })
        if (removedSlot !== null) {
          slotsRemoved.push(removedSlot)
        }
      })
    )
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { slotsRemoved, total: slotsRemoved.length },
          "Availabilites Removed Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Removing Availability")
  }
})

const getAvailability = asyncHandler(async (req, res) => {
  try {
    let availability
    if (req.query.type === "booked") {
      availability = await Availability.find({
        advisorId: req.params.id,
        slotDate: req.params.slotDate,
        booked: true,
      })
    } else if (req.query.type === "available") {
      availability = await Availability.find({
        advisorId: req.params.id,
        slotDate: req.params.slotDate,
        booked: false,
      })
    } else {
      availability = await Availability.find({
        advisorId: req.params.id,
        slotDate: req.params.slotDate,
      })
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { availability, total: availability.length },
          "Availabilites Fetched Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error FetchingAvailability")
  }
})

const getAllAvailability = asyncHandler(async (req, res) => {
  try {
    let availability
    if (req.query.type === "booked") {
      availability = await Availability.find({
        booked: true,
      })
    } else if (req.query.type === "available") {
      availability = await Availability.find({
        booked: false,
      })
    } else {
      availability = await Availability.find({})
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { availability, total: availability.length },
          "Availability fetched successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error fetching all availability")
  }
})

const bookAppointment = asyncHandler(async (req, res) => {
  try {
    const availabilityData = await Availability.findById(req.body.id)
    if (!availabilityData) throw new ApiError(400, "Appointment Slot Not Found")
    if (availabilityData.booked) {
      throw new ApiError(400, "Appointment Slot Already Booked")
    }
    const bookApp = await Appointment.create({
      availabilityId: availabilityData._id,
      clientId: req.user._id,
      advisorId: availabilityData.advisorId,
      scheduledAt: availabilityData.startTime,
      status: "scheduled",
    })
    availabilityData.booked = true
    availabilityData.save()
    return res
      .status(200)
      .json(new ApiResponse(200, bookApp, "Appointment Booked Successfully"))
  } catch (error) {
    throw new ApiError(400, error.message, "Error Booking Appointment")
  }
})

const cancelAppointment = asyncHandler(async (req, res) => {
  try {
    const appointmentData = await Appointment.findById(req.body.id)
    if (!appointmentData) throw new ApiError(400, "Appointment Not Found")
    const availabilityData = await Availability.findById(
      appointmentData.availabilityId
    )
    if (String(appointmentData.clientId) === String(req.user._id)) {
      appointmentData.status = "cancelled"
      appointmentData.overview = "Appointment Cancelled by Client"
    } else if (String(appointmentData.advisorId) === String(req.user._id)) {
      appointmentData.status = "cancelled"
      appointmentData.overview = "Appointment Cancelled by Advisor"
    } else {
      throw new ApiError(400, "Unauthorized Request")
    }
    if (!availabilityData) throw new ApiError(400, "Appointment Slot Not Found")
    availabilityData.booked = false
    availabilityData.save()
    appointmentData.save()
    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          { appointmentId: req.body.id },
          "Appointment Cancelled Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Deleting Appointment")
  }
})

const getAppointments = asyncHandler(async (req, res) => {
  try {
    let clientAppointments
    let advisorAppointments
    if (req.query.type === "scheduled" || req.query.type === "cancelled") {
      clientAppointments = await Appointment.find({
        clientId: req.user._id,
        status: req.query.type,
      })
      advisorAppointments = await Appointment.find({
        advisorId: req.user._id,
        status: req.query.type,
      })
    } else if (req.query.type === "all") {
      clientAppointments = await Appointment.find({
        clientId: req.user._id,
      })
      advisorAppointments = await Appointment.find({
        advisorId: req.user._id,
      })
    } else {
      throw new ApiError(400, "Invalid Query Parameter")
    }
    return res.status(200).json(
      new ApiResponse(
        201,
        {
          clientAppointments,
          advisorAppointments,
          totalClientAppointments: clientAppointments.length,
          totalAdvisorAppointments: advisorAppointments.length,
        },
        "Appointments Fetched Successfully"
      )
    )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Getting Appointments")
  }
})

export {
  addAvailability,
  removeAvailability,
  getAvailability,
  getAllAvailability,
  bookAppointment,
  cancelAppointment,
  getAppointments,
}
