import mongoose, { Schema } from "mongoose"

const availabilitySchema = new Schema(
  {
    slotDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    meetingDuration: {
      type: Number,
      required: true,
    },
    advisorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booked: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
)

const Availability = mongoose.model("Availability", availabilitySchema)

export default Availability
