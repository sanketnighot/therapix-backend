import { Router } from "express"
import {
  getContactForms,
  submitContactForm,
  updateContactFormStatus,
} from "../controllers/contactForm.controller.js"

const router = Router()

router.route("/").post(submitContactForm)
router.route("/").patch(updateContactFormStatus)
router.route("/").get(getContactForms)

export default router
