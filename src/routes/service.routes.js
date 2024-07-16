import { Router } from "express"
import {
  createService,
  getService,
  getAllServices,
  updateService,
  deleteService,
  getAllServicesByAdvisor,
} from "../controllers/services.controller.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/").post(verifyJwt, createService)
router.route("/:id").get(getService)
router.route("/").get(getAllServices)
router.route("/").patch(verifyJwt, updateService)
router.route("/:id").delete(verifyJwt, deleteService)
router.route("/advisor/:id").get(getAllServicesByAdvisor)

export default router
