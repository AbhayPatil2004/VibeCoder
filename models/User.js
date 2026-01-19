import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: String,
    image: String,
    role: {
      type: String,
      enum: ["ADMIN", "USER", "PREMIUM_USER"],
      default: "USER",
    },
    accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
