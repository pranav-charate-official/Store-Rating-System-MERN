import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         minLength: 20,
         maxLength: 60,
         required: true,
      },
      email: {
         type: String,
         unique: true,
         required: true,
      },
      address: {
         type: String,
         maxLength: 400,
         required: true,
      },
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

const Store = mongoose.model("Store", StoreSchema);

export default Store;
