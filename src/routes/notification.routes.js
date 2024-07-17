import Router from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
  getNotifications,
  updateNotificationStatus,
} from "../controllers/notification.controller.js"

const router = Router()

router.route("/update").post(verifyJwt, updateNotificationStatus)
router.route("/update/:id").post(verifyJwt, updateNotificationStatus)
router.route("/").get(getNotifications)

export default router
