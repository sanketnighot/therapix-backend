import dotenv from "dotenv"
dotenv.config()
import connectDB from "./db/index.js"
import app from "./app.js"
import logger from "./utils/logger.js"

const PORT = process.env.PORT || 8000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`⚙️ Server is running on port ${PORT}`)
    })
  })
  .catch((err) => logger.info("❌ MONGODB Connection Failed !!! ", err))
