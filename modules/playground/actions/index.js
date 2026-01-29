"use server";

import connectToDatabase from "@/lib/db";
import Playground from "@/models/Playground";
import TemplateFile from "@/models/TemplateFile";
import mongoose from "mongoose";
import { currentUser } from '@/modules/auth/actions/index.js'

export const getPlaygroundById = async (id) => {
  try {
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const playground = await Playground.findById(id)
      .select("title template description")
      .lean();

    if (!playground) return null;

    return {
      id: playground._id.toString(), // ✅ string
      title: playground.title,
      template: playground.template,
      description: playground.description,
    };
  } catch (error) {
    console.error("getPlaygroundById error:", error);
    return null;
  }
};


export const SaveUpdatedCode = async (playgroundId, data) => {
  try {
    const user = await currentUser();
    if (!user) return null;

    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(playgroundId)) {
      throw new Error("Invalid playgroundId");
    }

    const updatedTemplate = await TemplateFile.findOneAndUpdate(
      { playgroundId: new mongoose.Types.ObjectId(playgroundId) }, // ✅ FIX 3
      {
        content: JSON.stringify(data),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    if (!updatedTemplate) return null;

    return {
      id: updatedTemplate._id.toString(),
      playgroundId: updatedTemplate.playgroundId.toString(),
      content: updatedTemplate.content,
    };
  } catch (error) {
    console.error("SaveUpdatedCode error:", error);
    return null;
  }
};
