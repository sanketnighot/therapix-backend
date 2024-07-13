import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import ApiError from "./utils/ApiError.js"

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN, Credential: true }))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

// Routes Import
import userRouter from "./routes/user.routes.js"

// Routes Declaration
app.use("/api/v1/users", userRouter)
app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Connected to Therapix API" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: err.success,
      message: err.message,
      errors: err.errors,
      stack: err.stack,
    })
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }

  next()
})

export default app
