import mongoose, { Schema } from "mongoose"

const clientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
)

const Client = mongoose.model("Client", clientSchema)

export default Client
