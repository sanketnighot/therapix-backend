import { Router } from "express"
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAdvisorDetails,
} from "../controllers/user.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJwt, logoutUser)
router.route("/refreshTokens").post(refreshAccessToken)
router.route("/changeCurrentPassword").patch(verifyJwt, changeCurrentPassword)
router.route("/updateAccountDetails").patch(verifyJwt, updateAccountDetails)
router.route("/updateAdvisorDetails").patch(verifyJwt, updateAdvisorDetails)
router.route("/getCurrentUser").get(verifyJwt, getCurrentUser)

export default router
