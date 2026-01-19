import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const accountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    refreshToken: { type: String },
    accessToken: { type: String },
    expiresAt: { type: Number },
    tokenType: { type: String },
    scope: { type: String },
    idToken: { type: String },
    sessionState: { type: String },
  },
  { timestamps: true }
);

// Unique index for [provider, providerAccountId]
accountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

// Index on userId for faster queries
accountSchema.index({ userId: 1 });

// Prevent model overwrite upon hot reload in Next.js
const Account = models.Account || model("Account", accountSchema);

export default Account;