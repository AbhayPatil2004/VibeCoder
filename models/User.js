import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    // 🔑 NextAuth UUID (token.sub / user.id)
    authUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: { type: String, required: true, unique: true },
    name: String,
    image: String,

    role: {
      type: String,
      enum: ["ADMIN", "USER", "PREMIUM_USER"],
      default: "USER",
    },
    playgrounds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Playground",
      },
    ],

    // Mongo ObjectId references
    accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
