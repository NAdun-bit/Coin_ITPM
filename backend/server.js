// Import dependencies
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const dotenv = require("dotenv")

// Initialize express app and dotenv
const app = express()
dotenv.config()

// App port
const PORT = process.env.PORT || 8070

// Log environment variables (without sensitive info)
console.log("Environment variables check:")
console.log("- PORT:", PORT)
console.log("- MONGODB_URL/URI exists:", !!process.env.MONGODB_URL || !!process.env.MONGODB_URI)

// Middlewares
app.use(
  cors({
    origin: "*", // During development, allow all origins
    credentials: true,
  }),
)
app.use(bodyParser.json())

// MongoDB connection
const URL = process.env.MONGODB_URL || process.env.MONGODB_URI

console.log("Attempting to connect to MongoDB...")
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err)
    console.error("Connection string used (redacted):", URL ? URL.substring(0, 15) + "..." : "undefined")
    process.exit(1)
  })

// Check connection once open
const connection = mongoose.connection
connection.once("open", () => {
  console.log("✅ MongoDB Connection is open!")
})

// Import routes
const expenseRouter = require("./routes/expense.routes")

// Use routes
app.use("/api/expenses", expenseRouter)

// Sample route (optional for testing)
app.get("/", (req, res) => {
  console.log("Root endpoint accessed")
  res.send("🚀 Backend server is running!")
})

// Add a test endpoint
app.get("/api/test", (req, res) => {
  console.log("Test endpoint accessed")
  res.json({ message: "API is working!" })
})

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port: ${PORT}`)
})

