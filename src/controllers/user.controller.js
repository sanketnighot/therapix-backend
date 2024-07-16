import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import User from "../models/user.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import Advisor from "../models/advisor.model.js"
import Client from "../models/client.model.js"

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const userAccessToken = await user.generateAccessToken()
    const userRefreshToken = await user.generateRefreshToken()
    user.refreshToken = userRefreshToken
    await user.save({ validateBeforeSave: false })
    return { userAccessToken, userRefreshToken }
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token",
      error.message
    )
  }
}

const registerUser = asyncHandler(async (req, res) => {
  try {
    // get user details from req body
    const {
      username,
      email,
      password,
      phoneNumber,
      role,
      languages,
      gender,
      communicationPreference,
      licenseNumber,
      specialization,
      experience,
      qualification,
      status,
    } = req.body

    // validations
    if (
      [username, email, password, role, gender, phoneNumber].some(
        (field) => field?.trim() === "" || undefined
      )
    ) {
      throw new ApiError(400, "Please fill all the required fields")
    }

    // check if user already exisits: username, email, phone number
    const exisitingUser = await User.findOne({
      $or: [{ username }, { email }, { phoneNumber }],
    })

    if (exisitingUser) {
      throw new ApiError(409, "User already exists")
    }

    // create user object and an entry in db
    const user = await User.create({
      username,
      email,
      password,
      phoneNumber,
      role,
      languages,
      gender,
      communicationPreference,
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    // check for user creation
    if (!createdUser) {
      throw new ApiError(500, "Error while registration")
    }

    // Create advisor and client documents according to the role
    if (role === "advisor") {
      await Advisor.create({
        userId: createdUser._id,
        licenseNumber,
        specialization,
        experience,
        qualification,
        status,
      })
    } else if (role === "client") {
      await Client.create({
        userId: createdUser._id,
      })
    }

    // return response
    return res
      .status(201)
      .json(
        new ApiResponse(200, createdUser, "User registered successfully !!!")
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Registering User")
  }
})

const loginUser = asyncHandler(async (req, res) => {
  try {
    // get user data from body
    const { email, username, password, phoneNumber } = req.body

    // username or email
    if (!username && !email && !phoneNumber) {
      throw new ApiError(400, "Username or Email is required")
    }

    // find the user
    const user = await User.findOne({
      $or: [{ username }, { email }, { phoneNumber }],
    })

    if (!user) {
      throw new ApiError(404, "User does not exist")
    }

    // Check Password
    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid user Credentials")
    }

    // access and refresh token to be generated
    const { userAccessToken, userRefreshToken } =
      await generateAccessAndRefreshToken(user._id)

    // Send as both tokens as cookies
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )
    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
      .status(200)
      .cookie("accessToken", userAccessToken, options)
      .cookie("refreshToken", userRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, userAccessToken, userRefreshToken },
          "User Logged in successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message, "Error Logging in user")
  }
})

const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 },
      },
      { new: true }
    )

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Logged out successfully"))
  } catch (error) {
    throw new ApiError(400, error.mesage, "Error Logging out user")
  }
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // Get the refresh token from cookies
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body.refreshToken

    // Check if refresh token exists
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token not found")
    }

    // Verify refresh token
    const decodedToken = await jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    // Check if user exists
    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token")
    }

    // Check if refresh token is valid
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used")
    }

    // Generate new access token
    const { userAccessToken, userRefreshToken } =
      await generateAccessAndRefreshToken(user._id)

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
      .status(200)
      .cookie("accessToken", userAccessToken, options)
      .cookie("refreshToken", userRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken: userAccessToken, refreshToken: userRefreshToken },
          "Tokens Refreshed Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Request")
  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user.id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Invalid Old Password")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password updated successfully"))
  } catch (error) {
    throw new ApiError(400, error.message, "Error changing current password")
  }
})

const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "User fetched successfully"))
  } catch (error) {
    throw new ApiError(400, error.message, "Error fetching current user")
  }
})

const updateAccountDetails = asyncHandler(async (req, res) => {
  try {
    // Fetch the current user details
    const user = await User.findById(req.user._id)

    // Extract new user details from request body
    const updates = req.body

    // Dynamically update user fields based on what's provided in the request
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key]
      }
    })

    // Save the updated user document
    await user.save({ validateBeforeSave: false })

    // Return the updated user details without sensitive information
    const updatedUserData = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    res
      .status(200)
      .json(new ApiResponse(200, updatedUserData, "User Updated Successfully"))
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "An error occurred while updating user details"
    )
  }
})

const updateAdvisorDetails = asyncHandler(async (req, res) => {
  try {
    // Fetch the current user details
    const user = await Advisor.findOne({ userId: req.user._id })

    // Validate if user role is 'advisor'
    if (!user) {
      throw new ApiError(403, "You are not authorized to perform this action")
    }

    // Extract new advisor details from request body
    const updates = req.body

    // Dynamically update user fields based on what's provided in the request
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key]
      }
    })
    // Save the updated user document
    await user.save({ validateBeforeSave: false })
    // Return the updated user details without sensitive information
    const updatedUserData = await Advisor.findOne({ userId: req.user._id })
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedUserData, "Advisor Updated Successfully")
      )
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "An error occurred while updating user details"
    )
  }
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAdvisorDetails,
}
