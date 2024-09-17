import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/DatabaseModels.js";

dotenv.config();

const auth = async (req, res, next) => {
   try {
      const authHeader = req.header("Authorization");
      if (!authHeader) {
         return res.status(401).send({ error: "No token provided" });
      }

      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
         _id: decoded._id,
         "tokens.token": token,
      });

      if (!user) {
         throw new Error();
      }

      req.token = token;
      req.user = user;
      next();
   } catch (error) {
      res.status(401).send({ error: "Please authenticate." });
   }
};

export default auth;
