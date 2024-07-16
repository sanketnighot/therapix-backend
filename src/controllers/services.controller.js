import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import User from "../models/user.model.js"
import Service from "../models/service.model.js"
import ApiResponse from "../utils/ApiResponse.js"

const createService = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const { name, description, tags, price } = req.body
    if (!user) {
      throw new ApiError(404, "User not found")
    }
    if (user.role !== "advisor") {
      throw new ApiError(403, "You are not an advisor")
    }
    const service = await Service.create({
      advisorId: user._id,
      name,
      description,
      tags,
      price,
    })

    return res
      .status(200)
      .json(new ApiResponse(200, service, "Service Created Successfully"))
  } catch (error) {
    throw new ApiError(400, error.message, "Error Creating Service")
  }
})

const getService = asyncHandler(async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      throw new ApiError(404, "Service not found")
    }
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { services: service, total: service.length },
          "Service Found"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Getting Service")
  }
})

const getAllServices = asyncHandler(async (req, res) => {
  try {
    const services = await Service.find({})
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { services, total: services.length },
          "Services Fetch Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Fetching Services")
  }
})

const updateService = asyncHandler(async (req, res) => {
  try {
    const service = await Service.findById(req.body.id)
    if (!service) throw new ApiError(404, "Service not found")
    if (String(service.advisorId) !== String(req.user._id)) {
      throw new ApiError(404, "Unauthorized Request")
    }
    const updateService = await Service.findByIdAndUpdate(
      req.body.id,
      req.body,
      { new: true }
    )
    return res
      .status(200)
      .json(new ApiResponse(200, updateService, "Service Updated Successfully"))
  } catch (error) {
    throw new ApiError(400, error.message, "Error Updating Service")
  }
})

const deleteService = asyncHandler(async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) throw new ApiError(404, "Service not found")
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { serviceId: req.params.id },
          "Service Deleted Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Deleting Service")
  }
})

const getAllServicesByAdvisor = asyncHandler(async (req, res) => {
  try {
    const services = await Service.find({ advisorId: req.params.id })
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { services, total: services.length },
          "Services Fetch Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Fetching Services")
  }
})

// const getAllServicesByCategory = asyncHandler(async (req, res) => {})

export {
  createService,
  getService,
  getAllServices,
  updateService,
  deleteService,
  getAllServicesByAdvisor,
  // getAllServicesByCategory,
}
