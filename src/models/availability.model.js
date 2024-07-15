import mongoose, { Schema } from "mongoose"

const availabilitySchema = new Schema(
  {
    date: {
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
    advisor: {
      type: Schema.Types.ObjectId,
      ref: "Advisor",
    },
  },
  { timestamps: true }
)

const Availability = mongoose.model("Availability", availabilitySchema)

export default Availability
