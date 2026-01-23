import mongoose, { Schema, model, models } from "mongoose";

const templateFileSchema = new Schema(
  {
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },

    playgroundId: {
      type: Schema.Types.ObjectId,
      ref: "Playground",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const TemplateFile =
  models.TemplateFile || model("TemplateFile", templateFileSchema);

export default TemplateFile;
