import express from "express";
import cors from "cors";
import connectDB from "./config/server.config.js";
import authRoutes from "./routes/authRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
   res.send("Hello from the backend!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
   console.log(`http://localhost:${PORT}`);
});
