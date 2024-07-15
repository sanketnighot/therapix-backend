import mongoose, { Schema } from "mongoose"

const qustionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Question = mongoose.model("Question", qustionSchema)

export default Question
