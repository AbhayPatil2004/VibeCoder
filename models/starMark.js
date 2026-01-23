import mongoose, { Schema, model, models } from "mongoose";

const starMarkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    playgroundId: {
      type: Schema.Types.ObjectId,
      ref: "Playground",
      required: true,
    },

    isMarked: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

starMarkSchema.index(
  { userId: 1, playgroundId: 1 },
  { unique: true }
);

const StarMark =
  models.StarMark || model("StarMark", starMarkSchema);

export default StarMark;
