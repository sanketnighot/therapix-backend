import asyncHandler from "../utils/asyncHandler.js"
import ContactForm from "../models/contactForm.model.js"
import ApiResponse from "../utils/ApiResponse.js"
import ApiError from "../utils/ApiError.js"

const submitContactForm = asyncHandler(async (req, res) => {
  try {
    const { name, email, message } = req.body
    const contactForm = await ContactForm.create({
      name,
      email,
      message,
    })
    res
      .status(201)
      .json(
        new ApiResponse(
          200,
          contactForm,
          "Contract Form Submitted Successfully"
        )
      )
  } catch (error) {
    throw new ApiError(400, error.message)
  }
})

const updateContactFormStatus = asyncHandler(async (req, res) => {
  const { id, status } = req.body

  if (status === "read") {
    const contactForm = await ContactForm.findByIdAndUpdate(
      id,
      { responded: true },
      { new: true }
    )
    res
      .status(200)
      .json(
        new ApiResponse(200, contactForm, "Contact Form Updated Successfully")
      )
  } else if (status === "unread") {
    const contactForm = await ContactForm.findByIdAndUpdate(
      id,
      {
        responded: false,
      },
      { new: true }
    )
    res
      .status(200)
      .json(
        new ApiResponse(200, contactForm, "Contact Form Updated Successfully")
      )
  } else {
    throw new ApiError(400, "Invalid status")
  }
})

const getContactForms = asyncHandler(async (req, res) => {
  const { type } = req.query
  let fetchType = {}
  if (type === "read") {
    fetchType = { responded: true }
  } else if (type === "unread") {
    fetchType = { responded: false }
  }
  let contactForms = await ContactForm.find(fetchType)
  const data = {
    contactForms: contactForms,
    total: contactForms.length,
  }
  res
    .status(200)
    .json(new ApiResponse(200, data, "Contact Forms Fetched Successfully"))
})

export { submitContactForm, getContactForms, updateContactFormStatus }
