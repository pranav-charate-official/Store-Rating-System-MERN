import express from "express";
import auth from "../middlewares/auth.js";
import {
   signup,
   login,
   profile,
   logout,
   changePassword,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", auth, profile);
router.post("/logout", auth, logout);
router.post("/change-password", auth, changePassword);

export default router;
