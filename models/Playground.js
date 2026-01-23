import mongoose, { Schema, model, models } from "mongoose";

const playgroundSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    template: {
      type: String,
      enum: ["REACT", "NEXTJS", "EXPRESS", "VUE", "HONO", "ANGULAR"],
      default: "REACT",
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Playground =
  models.Playground || model("Playground", playgroundSchema);

export default Playground;
