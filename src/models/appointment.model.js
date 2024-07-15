import mongoose, { Schema } from "mongoose"

const AppointmentSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    advisorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "scheduled",
      enum: ["scheduled", "completed", "canceled"],
    }, // 'scheduled', 'completed', 'canceled'
    overview: {
      type: String,
    },
  },
  { timestamps: true }
)

const Appointment = mongoose.model("Appointment", AppointmentSchema)

export default Appointment
