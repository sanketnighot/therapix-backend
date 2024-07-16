import Router from "express"
import {
  subscribeToNewsletter,
  getAllSubscriptions,
  unsubscribeToNewsLetter,
} from "../controllers/newsletter.controller.js"

const router = Router()

router.route("/").post(subscribeToNewsletter)
router.route("/").delete(unsubscribeToNewsLetter)
router.route("/").get(getAllSubscriptions)

export default router
