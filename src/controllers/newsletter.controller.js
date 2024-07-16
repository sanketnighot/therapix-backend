import asyncHandler from "../utils/asyncHandler.js"
import Newsletter from "../models/newsletter.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"

const subscribeToNewsletter = asyncHandler(async (req, res) => {
  try {
    const subscribe = await Newsletter.create({ email: req.body.email })
    return res
      .status(201)
      .json(
        new ApiResponse(200, subscribe, "Newletter Subscribed Successfully")
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Subscribing to Newsletter")
  }
})

const unsubscribeToNewsLetter = asyncHandler(async (req, res) => {
  try {
    if (!req.body.email)
      return res.status(400).json(new ApiError(400, "Email is required"))
    await Newsletter.findOneAndDelete({
      email: req.body.email,
    })
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { email: req.body.email },
          "Newsletter Unsubscribed Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Unsubscribing to Newsletter")
  }
})

const getAllSubscriptions = asyncHandler(async (req, res) => {
  try {
    const subscriptions = await Newsletter.find({})
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          { subscriptions: subscriptions, total: subscriptions.length },
          "Subscriptions fetched successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error fetching subscriptions")
  }
})

export { subscribeToNewsletter, unsubscribeToNewsLetter, getAllSubscriptions }
