import bcrypt from "bcrypt";
import { User, Rating, Store } from "../models/DatabaseModels.js";

// Middleware to check if the user is a System Admin
const isAdmin = (req, res, next) => {
   if (req.user.role !== "System Admin") {
      return res.status(403).send({ error: "Access denied" });
   }
   next();
};

// Middleware to check if the user is a Store Owner
const isStoreOwner = (req, res, next) => {
   if (req.user.role !== "Store Owner") {
      return res.status(403).send({ error: "Access denied" });
   }
   next();
};

// Get admin dashboard data
const getAdminDashboardData = async (req, res) => {
   try {
      const users = await User.find();
      const stores = await Store.find();

      // Calculate average rating for each store
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
            return { ...store.toObject(), averageRating };
         })
      );

      // Map store owners to their average ratings
      const usersWithRatings = users.map((user) => {
         if (user.role === "Store Owner") {
            const userStore = storesWithRatings.find(
               (store) => store.owner.toString() === user._id.toString()
            );
            return {
               ...user.toObject(),
               averageRating: userStore ? userStore.averageRating : "N/A",
            };
         }
         return user;
      });

      const ratings = await Rating.find();

      res.status(200).send({
         users: usersWithRatings,
         stores: storesWithRatings,
         ratings,
      });
   } catch (err) {
      res.status(500).send({ error: "Failed to fetch dashboard data" });
   }
};

const getStoreOwnerDashboardData = async (req, res) => {
   try {
      const store = await Store.findOne({ owner: req.user._id });
      if (!store) {
         return res.status(404).send({ error: "Store not found" });
      }

      const ratings = await Rating.find({ store: store._id }).populate(
         "user",
         "name email address"
      );
      const totalRating = ratings.reduce(
         (acc, rating) => acc + rating.rating,
         0
      );
      const averageRating = ratings.length ? totalRating / ratings.length : 0;

      const usersWhoRated = ratings.map((rating) => ({
         ...rating.user.toObject(),
         rating: rating.rating,
      }));

      res.send({
         usersWhoRated,
         averageRating,
      });
   } catch (err) {
      res.status(400).send(err);
   }
};

// Add a new user
const addUser = async (req, res) => {
   try {
      const { name, email, password, address, role } = req.body;

      // Validate input
      if (!name || !email || !password || !address) {
         return res.status(400).send({ error: "All fields are required" });
      }

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
         role,
      });
      await user.save();

      res.status(201).send(user);
   } catch (err) {
      res.status(400).send(err);
   }
};

// Get all users
const getAllUsers = async (req, res) => {
   try {
      const users = await User.find();

      // Fetch ratings for store owners
      const usersWithRatings = await Promise.all(
         users.map(async (user) => {
            if (user.role === "Store Owner") {
               const store = await Store.findOne({ owner: user._id });
               if (store) {
                  const ratings = await Rating.find({ store: store._id });
                  const totalRating = ratings.reduce(
                     (acc, rating) => acc + rating.rating,
                     0
                  );
                  const averageRating = ratings.length
                     ? totalRating / ratings.length
                     : 0;
                  return { ...user.toObject(), averageRating };
               }
            }
            return user;
         })
      );

      res.send(usersWithRatings);
   } catch (err) {
      res.status(400).send(err);
   }
};

// Get list of users who submitted ratings for the store owned by the authenticated store owner
const getUsersWhoRatedStore = async (req, res) => {
   try {
      const store = await Store.findOne({ owner: req.user._id });
      if (!store) {
         return res.status(404).send({ error: "Store not found" });
      }

      const ratings = await Rating.find({ store: store._id }).populate(
         "user",
         "name email address"
      );
      res.send(ratings);
   } catch (err) {
      res.status(400).send(err);
   }
};

export {
   isAdmin,
   isStoreOwner,
   getAdminDashboardData,
   getStoreOwnerDashboardData,
   addUser,
   getAllUsers,
   getUsersWhoRatedStore,
};
