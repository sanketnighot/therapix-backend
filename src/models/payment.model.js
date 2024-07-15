import mongoose, { Schema } from "mongoose"

const paymentSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    advisorId: {
      type: Schema.Types.ObjectId,
      ref: "Advisor",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "completed", "failed"],
    }, // 'pending', 'completed', 'failed'
    paymentMethod: {
      type: String,
      required: true,
      enum: ["credit card", "UPI", "net banking"],
    }, // 'credit card', 'UPI', etc.
  },
  { timestamps: true }
)

const Payment = mongoose.model("Payment", paymentSchema)

export default Payment
