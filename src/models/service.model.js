import mongoose, { Schema } from "mongoose"

const serviceSchema = new Schema(
  {
    advisorId: {
      type: Schema.Types.ObjectId,
      ref: "Advisor",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 300,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    }, // 'love', 'life', 'depression', 'stress', etc.
  },
  { timestamps: true }
)

const Service = mongoose.model("Service", serviceSchema)

export default Service
