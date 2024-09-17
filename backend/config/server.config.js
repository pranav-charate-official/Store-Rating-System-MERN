import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/DatabaseModels.js";

dotenv.config();

const connectDB = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });
      console.log("MongoDB connected");

      // Create a default admin user
      const admin = await User.findOne({ email: "system_admin@gmail.com" });
      if (!admin) {
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash("admin123", salt);
         const newAdmin = new User({
            name: "System Admin 1 Lorem ipsum dolor",
            email: "system_admin@gmail.com",
            password: hashedPassword,
            role: "System Admin",
         });
         await newAdmin.save();
      }
   } catch (err) {
      console.error("Error connecting to MongoDB:", err);
   }
};

export default connectDB;
