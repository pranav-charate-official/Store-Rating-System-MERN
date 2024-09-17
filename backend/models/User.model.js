import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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
      password: {
         type: String,
         required: true,
      },
      address: {
         type: String,
         maxLength: 400,
      },
      role: {
         type: String,
         enum: ["Normal User", "System Admin", "Store Owner"],
         default: "Normal User",
      },
      tokens: [
         {
            token: {
               type: String,
               required: true,
            },
         },
      ],
   },
   {
      timestamps: true,
   }
);

const User = mongoose.model("User", UserSchema);

export default User;
