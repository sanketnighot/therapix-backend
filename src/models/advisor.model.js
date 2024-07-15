import mongoose, { Schema } from "mongoose"

const advisorSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
    },
    specialization: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      required: true,
    },
    platformFeePercentage: {
      type: Number,
      default: 10,
    },
    experience: {
      type: String,
    },
    qualification: {
      type: String,
    },
    status: {
      type: String,
      default: "offline",
      enum: ["online", "offline", "in meeting"],
    }, // 'online', 'offline', 'in meeting', etc.
  },
  { timestamps: true }
)

const Advisor = mongoose.model("Advisor", advisorSchema)

export default Advisor
