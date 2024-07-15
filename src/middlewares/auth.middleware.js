import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import User from "../models/user.model.js"

const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    // Get access token from cookies or header
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "")

    // Check if access token exists
    if (!accessToken) {
      throw new ApiError(401, "Unauthorized Request")
    }

    // Verify access token
    const decodedToken = await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    )

    // Check if user exists
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    )

    if (!user) {
      throw new ApiError(401, "Invalid Access Token")
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Error while verifying user")
  }
})

export { verifyJwt }
