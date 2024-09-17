import express from "express";
import auth from "../middlewares/auth.js";
import {
   addStore,
   getAllStores,
   submitRating,
   getStoreRatings,
   getAverageRating,
} from "../controllers/storeController.js";

const router = express.Router();

// Middleware to check if the user is a System Admin
const isAdmin = (req, res, next) => {
   if (req.user.role !== "System Admin") {
      return res.status(403).send({ error: "Access denied" });
   }
   next();
};

// Add a new store
router.post("/", auth, isAdmin, addStore);

// Get all stores
router.get("/", auth, getAllStores);

// Submit a rating for a store
router.post("/rate", auth, submitRating);

// Get ratings for a store
router.get("/:storeId/ratings", auth, getStoreRatings);

// Get average rating for a store
router.get("/:storeId/average-rating", auth, getAverageRating);

export default router;
