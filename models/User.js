import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    // 🔑 NextAuth user id (token.sub)
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: String,
    image: String,

    role: {
      type: String,
      enum: ["ADMIN", "USER", "PREMIUM_USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
