import Review from "../models/review.model.js"
import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import Service from "../models/service.model.js"
import ApiResponse from "../utils/ApiResponse.js"

const submitReview = asyncHandler(async (req, res) => {
  try {
    if (!req.body.serviceId) {
      throw new ApiError(400, "Service ID is required", "Invalid Service ID")
    }
    const service = await Service.findById(req.body.serviceId)
    if (!service) {
      throw new ApiError(400, "Invalid Service ID")
    }
    const review = await Review.create({
      clientId: req.user._id,
      advisorId: service.advisorId,
      serviceId: service._id,
      rating: req.body.rating,
      comment: req.body.comment,
      isAnonymous: req.body.isAnonymous,
    })
    return res
      .status(201)
      .json(new ApiResponse(200, review, "Review Submitted Successfully"))
  } catch (error) {
    throw new ApiError(400, error.message, "Error Submitting Review")
  }
})

const getReviews = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id) throw new ApiError(400, "Advisor ID is required")
    const reviews = await Review.find({ advisorId: req.params.id })
    const averageRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reviews: reviews, averageRating: averageRating.toFixed(1) },
          "Reviews Fetched Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Fetching Reviews")
  }
})

const updateReview = asyncHandler(async (req, res) => {
  try {
    if (!req.body.id) {
      throw new ApiError(400, "Review ID is required", "Invalid Review ID")
    }
    const review = await Review.findById(req.body.id)
    if (!review) {
      throw new ApiError(400, "Invalid Review ID")
    }
    if (String(review.clientId) !== String(req.user._id)) {
      throw new ApiError(400, "Unauthorized Request")
    }
    if (req.body.comment) {
      review.comment = req.body.comment
    }
    if (req.body.rating) {
      review.rating = req.body.rating
    }
    if (req.body.isAnonymous) {
      review.isAnonymous = req.body.isAnonymous
    }
    review.save()
    return res
      .status(201)
      .json(new ApiResponse(201, review, "Review Updated Successfully"))
  } catch (error) {
    throw new ApiError(400, error.message, "Error Updating Review")
  }
})

const removeReview = asyncHandler(async (req, res) => {
  try {
    if (!req.params.id) {
      throw new ApiError(400, "Review ID is required", "Invalid Review ID")
    }
    const review = await Review.findById(req.params.id)
    if (!review) {
      throw new ApiError(400, "Invalid Review ID")
    }
    if (String(review.clientId) !== String(req.user._id)) {
      throw new ApiError(400, "Unauthorized Request")
    }
    await Review.findByIdAndDelete(req.params.id)
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Review Removed Successfully"))
  } catch (error) {
    throw new ApiError(400, error.message, "Error Removing Review")
  }
})

export { submitReview, updateReview, removeReview, getReviews }
