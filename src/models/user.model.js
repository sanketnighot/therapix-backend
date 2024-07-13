import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    refereshToken: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      required: [true, "User Role is required"],
      trim: true,
    }, // 'client' or 'therapist'
    isAnonymous: {
      type: Boolean,
      trim: true,
      default: false,
    },
    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    languages: [
      {
        type: String,
      },
    ],
    gender: {
      type: String,
    },
    communicationPreference: {
      type: String,
    }, // 'phone', 'email', etc.
    profileStatus: {
      type: String,
    }, // 'active', 'disabled', 'private', 'public', 'archived'
  },
  { timestamps: true }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  this.password = bcrypt.hash(this.password, 12)

  next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  )
}

userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  )
}

export const User = mongoose.model("User", userSchema)
