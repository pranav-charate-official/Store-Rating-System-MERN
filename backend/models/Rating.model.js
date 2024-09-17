import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
   {
      store: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Store",
         required: true,
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      rating: {
         type: Number,
         min: 1,
         max: 5,
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

const Rating = mongoose.model("Rating", RatingSchema);

export default Rating;
