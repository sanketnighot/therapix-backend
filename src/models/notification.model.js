import mongoose, { Schema } from "mongoose"

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "info",
    },
    heading: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "unread",
      enum: ["unread", "read"],
    }, // 'unread', 'read'
    link: {
      type: String,
    },
  },
  { timestamps: true }
)

const Notification = mongoose.model("Notification", notificationSchema)

export default Notification
