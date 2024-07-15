import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import ApiError from "./utils/ApiError.js"
import logger from "./utils/logger.js"
import morgan from "morgan"

const morganFormat = ":method :url :status: :response-time ms"

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN, Credential: true }))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(cookieParser())

// Configuring logger
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3] + " ms",
        }
        logger.info(JSON.stringify(logObject))
      },
    },
  })
)

// Routes Import
import userRouter from "./routes/user.routes.js"
import healthCheckRouter from "./routes/healthCheck.routes.js"
import contactFormRouter from "./routes/contactForm.routes.js"

// Routes Declaration
app.use("/api/v1/healthCheck", healthCheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/contactForms", contactFormRouter)
app.get("/", (req, res) => {
  try {
    res.status(200).json({ message: "Connected to Therapix API" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    logger.error(
      JSON.stringify({
        message: err.message || "Internal Server Error",
        ip: req.ip,
      })
    )
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      success: err.success,
      message: err.message,
      errors: err.errors,
      stack: err.stack,
    })
  } else {
    logger.error(
      JSON.stringify({
        message: err.message || "Internal Server Error",
        url: req.url,
        status: 500,
        ip: req.ip,
      })
    )
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    })
  }

  next()
})

export default app
