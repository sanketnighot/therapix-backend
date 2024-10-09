import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"
import logger from "../utils/logger.js"

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    )
    logger.info(
      `MongoDB Connected !!! DB HOST: ${connectionInstance.connection.host}`
    )
  } catch (error) {
    logger.error("MONGODB Connection Failed: ", error)
    process.exit(1)
  }
}

export default connectDB
