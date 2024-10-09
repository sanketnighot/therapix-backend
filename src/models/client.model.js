import mongoose, { Schema } from "mongoose"

const clientSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true }
)

const Client = mongoose.model("Client", clientSchema)

export default Client
