import dotenv from "dotenv"
dotenv.config()
import connectDB from "./db/index.js"
import app from "./app.js"

const PORT = process.env.PORT || 8000

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => console.log("MONGODB Connection Failed !!! ", err))
