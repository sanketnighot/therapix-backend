import { Router } from "express"
import {
  getContactForms,
  submitContactForm,
  updateContactFormStatus,
} from "../controllers/contactForm.controller.js"

const router = Router()

router.post("/", submitContactForm)
router.patch("/", updateContactFormStatus)
router.get("/", getContactForms)

export default router
