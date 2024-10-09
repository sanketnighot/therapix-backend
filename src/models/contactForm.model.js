import mongoose, { Schema } from "mongoose"

const contactFormSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email Id is required"],
    },
    name: {
      type: String,
      required: [true, "Full Name is required"],
    },
    message: {
      type: String,
      required: [true, "Your message is required"],
    },
    responded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const ContactForm = mongoose.model("ContactForm", contactFormSchema)

export default ContactForm
