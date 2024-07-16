import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"

const healthCheck = asyncHandler((req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, "OK", "Heath Check Passed"))
  } catch (error) {
    throw new ApiError(400, error.message, "API looks Unhealthy")
  }
})

export { healthCheck }
