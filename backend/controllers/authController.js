import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/DatabaseModels.js";
import dotenv from "dotenv";

dotenv.config();

const signup = async (req, res) => {
   const { name, email, address, password } = req.body;

   try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).send({ error: "User already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = new User({
         name,
         email,
         password: hashedPassword,
         address,
         role: "Normal User",
      });
      await user.save();

      res.status(201).send({ message: "User created successfully" });
   } catch (err) {
      res.status(500).send({ error: "Internal server error" });
   }
};

const login = async (req, res) => {
   const { email, password, role } = req.body;

   try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).send({ error: "User not found" });
      }

      // Check if password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).send({ error: "Invalid credentials" });
      }

      // Check if role matches
      if (user.role !== role) {
         return res.status(400).send({ error: "Invalid role" });
      }

      // Generate JWT token
      const token = jwt.sign(
         { _id: user._id.toString(), role: user.role },
         process.env.JWT_SECRET
      );

      user.tokens = user.tokens.concat({ token });
      await user.save();

      res.status(200).send({ message: "Login successful", token });
   } catch (err) {
      res.status(500).send({ error: "Internal server error" });
   }
};

const profile = async (req, res) => {
   res.send(req.user);
};

const logout = async (req, res) => {
   try {
      req.user.tokens = req.user.tokens.filter(
         (token) => token.token !== req.token
      );
      await req.user.save();
      res.send({ message: "Logged out successfully" });
   } catch (err) {
      res.status(500).send(err);
   }
};

const changePassword = async (req, res) => {
   try {
      const { oldPassword, newPassword } = req.body;

      // Validate input
      if (!oldPassword || !newPassword) {
         return res
            .status(400)
            .send({ error: "Old and new passwords are required" });
      }

      // Check old password
      const isMatch = await bcrypt.compare(oldPassword, req.user.password);
      if (!isMatch) {
         return res.status(400).send({ error: "Old password is incorrect" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      req.user.password = hashedPassword;
      await req.user.save();

      res.send({ message: "Password changed successfully" });
   } catch (err) {
      res.status(500).send(err);
   }
};

export { signup, login, profile, logout, changePassword };
