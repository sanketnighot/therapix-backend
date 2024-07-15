import mongoose, { Schema } from "mongoose"

const reviewSchema = new Schema(
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
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 100,
      required: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Review = mongoose.model("Review", reviewSchema)

export default Review
