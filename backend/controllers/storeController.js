import { User, Store, Rating } from "../models/DatabaseModels.js";

// Add a new store
const addStore = async (req, res) => {
   try {
      const { name, email, address, owner } = req.body;

      // Validate input
      if (!name || !email || !address || !owner) {
         return res.status(400).send({ error: "All fields are required" });
      }

      // Validate name length
      if (name.length < 20 || name.length > 60) {
         return res
            .status(400)
            .send({ error: "Name must be between 20 and 60 characters long" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         return res.status(400).send({ error: "Invalid email address" });
      }

      // Validate address length
      if (address.length > 400) {
         return res
            .status(400)
            .send({ error: "Address must be less than 400 characters long" });
      }

      // Check if store already exists
      const existingStore = await Store.findOne({ email });
      if (existingStore) {
         return res.status(400).send({ error: "Store already exists" });
      }

      // Check if owner exists and is a Store Owner
      const ownerUser = await User.findOne({ email: owner });
      if (!ownerUser || ownerUser.role !== "Store Owner") {
         return res
            .status(400)
            .send({ error: "Owner must be a valid Store Owner" });
      }

      // Create new store
      const store = new Store({ name, email, address, owner: ownerUser._id });
      await store.save();

      res.status(201).send(store);
   } catch (err) {
      res.status(500).send({ error: "Internal Server Error" });
   }
};

// Get all stores
const getAllStores = async (req, res) => {
   try {
      const stores = await Store.find().populate("owner", "name email address");

      // Calculate average rating for each store and include user's rating
      const storesWithRatings = await Promise.all(
         stores.map(async (store) => {
            const ratings = await Rating.find({ store: store._id });
            const totalRating = ratings.reduce(
               (acc, rating) => acc + rating.rating,
               0
            );
            const averageRating = ratings.length
               ? totalRating / ratings.length
               : 0;

            // Find the user's rating for this store
            const userRating = ratings.find(
               (rating) => rating.user.toString() === req.user._id.toString()
            );

            return {
               ...store.toObject(),
               averageRating,
               userRating: userRating ? userRating.rating : "Not rated",
            };
         })
      );

      res.status(200).send(storesWithRatings);
   } catch (err) {
      res.status(400).send(err);
   }
};

// Submit a rating for a store
const submitRating = async (req, res) => {
   try {
      const { storeId, rating } = req.body;

      // Validate input
      if (!storeId || !rating) {
         return res
            .status(400)
            .send({ error: "Store ID and rating are required" });
      }

      // Check if store exists
      const store = await Store.findById(storeId);
      if (!store) {
         return res.status(404).send({ error: "Store not found" });
      }

      // Check if user has already submitted a rating
      const existingRating = await Rating.findOne({
         store: storeId,
         user: req.user._id,
      });
      if (existingRating) {
         // Update existing rating
         existingRating.rating = rating;
         await existingRating.save();
         return res.send(existingRating);
      }

      // Create new rating
      const newRating = new Rating({
         store: storeId,
         user: req.user._id,
         rating,
      });
      await newRating.save();

      res.status(201).send(newRating);
   } catch (err) {
      res.status(400).send(err);
   }
};

// Get ratings for a store
const getStoreRatings = async (req, res) => {
   try {
      const { storeId } = req.params;
      const ratings = await Rating.find({ store: storeId }).populate(
         "user",
         "name email address"
      );

      res.send(ratings);
   } catch (err) {
      res.status(400).send(err);
   }
};

// Get average rating for a store
const getAverageRating = async (req, res) => {
   try {
      const { storeId } = req.params;
      const ratings = await Rating.find({ store: storeId });

      if (ratings.length === 0) {
         return res.send({ averageRating: 0 });
      }

      const totalRating = ratings.reduce(
         (acc, rating) => acc + rating.rating,
         0
      );
      const averageRating = totalRating / ratings.length;

      res.send({ averageRating });
   } catch (err) {
      res.status(400).send(err);
   }
};

export {
   addStore,
   getAllStores,
   submitRating,
   getStoreRatings,
   getAverageRating,
};
