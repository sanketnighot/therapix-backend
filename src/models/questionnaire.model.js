import mongoose, { Schema } from "mongoose"

const questionnaireSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionnaire: [
      {
        question: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
)

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema)

export default Questionnaire
