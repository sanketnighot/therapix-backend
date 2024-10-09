import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import Notification from "../models/notification.model.js"
import ApiResponse from "../utils/ApiResponse.js"

const updateNotificationStatus = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id) {
      await Notification.updateMany(
        { userId: req.user._id },
        { $set: { status: req.body.status } }
      )
    } else {
      await Notification.updateOne(
        { _id: req.params.id, userId: req.user._id },
        { $set: { status: req.body.status } }
      )
    }
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Notifications Updated Successfully"))
  } catch (error) {
    throw new ApiError(400, error.message, "Error Updating Notification Status")
  }
})

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.id })
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { notifications, total: notifications.length },
          "Notifications fetched Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Getting Notifiactions")
  }
})

export { updateNotificationStatus, getNotifications }
