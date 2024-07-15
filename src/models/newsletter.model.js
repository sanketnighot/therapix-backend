import mongoose, { Schema } from "mongoose"

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
)

const Newsletter = mongoose.model("Newsletter", newsletterSchema)

export default Newsletter
