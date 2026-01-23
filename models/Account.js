import mongoose, { Schema, model, models } from "mongoose";

const accountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: String,
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },

    refreshToken: String,
    accessToken: String,
    expiresAt: Number,
    tokenType: String,
    scope: String,
    idToken: String,
    sessionState: String,
  },
  { timestamps: true }
);

accountSchema.index(
  { provider: 1, providerAccountId: 1 },
  { unique: true }
);

const Account = models.Account || model("Account", accountSchema);
export default Account;
