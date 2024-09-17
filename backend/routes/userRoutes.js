import express from "express";
import auth from "../middlewares/auth.js";
import {
   isAdmin,
   isStoreOwner,
   getAdminDashboardData,
   getStoreOwnerDashboardData,
   addUser,
   getAllUsers,
   getUsersWhoRatedStore,
} from "../controllers/userController.js";

const router = express.Router();

// Add a new user
router.post("/", auth, isAdmin, addUser);

// Get all users
router.get("/", auth, isAdmin, getAllUsers);

// Get list of users who submitted ratings for the store owned by the authenticated store owner
router.get("/ratings", auth, isStoreOwner, getUsersWhoRatedStore);

// Get data for the admin dashboard
router.get("/admin/dashboard", auth, isAdmin, getAdminDashboardData);

router.get(
   "/storeOwner/dashboard",
   auth,
   isStoreOwner,
   getStoreOwnerDashboardData
);

export default router;
