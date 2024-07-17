import { Router } from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
  getReviews,
  removeReview,
  submitReview,
  updateReview,
} from "../controllers/review.controller.js"

const router = Router()

router.route("/").post(verifyJwt, submitReview)
router.route("/").patch(verifyJwt, updateReview)
router.route("/:id").delete(verifyJwt, removeReview)
router.route("/:id").get(getReviews)

export default router
