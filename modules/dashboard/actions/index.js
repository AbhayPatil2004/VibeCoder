"use server";

import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/db";
import Playground from "@/models/Playground";
import User from "@/models/User";
import StarMark from "@/models/starMark.js";
import {auth } from '@/auth'

import {
  getAccountByUserId,
  getUserByAuthId
} from "@/modules/auth/actions";

import { getUserByEmail } from '@/modules/auth/actions'

/**
 * Get all playgrounds (NO AUTH)
 */
export const getAllPlayground = async () => {
  try {
    await connectToDatabase();

    const playgrounds = await Playground.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name image email")
      .lean();

    return playgrounds.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      template: p.template,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      user: {
        name: p.userId?.name ?? "Unknown",
        image: p.userId?.image ?? "/placeholder.svg",
      },
    }));
  } catch (error) {
    console.error("getAllPlayground error:", error);
    return [];
  }
};

/**
 * Create playground (NO AUTH)
 */
// export const createPlayground = async (data) => {
//   try {
//     await connectToDatabase();

//     const playground = await Playground.create({
//       title: data.title,
//       description: data.description,
//       template: data.template,
//       userId: data.userId || null, // optional
//     });

//     revalidatePath("/dashboard");
//     return playground;
//   } catch (error) {
//     console.error("createPlayground error:", error);
//     throw error;
//   }
// };


export const createPlayground = async (data) => {
  try {
    await connectToDatabase();

    const session = await auth();

    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const dbUser = await getUserByEmail(session.user.email);

    if (!dbUser?._id) {
      throw new Error("User not found in DB");
    }

    const playground = await Playground.create({
      title: data.title,
      description: data.description,
      template: data.template,
      userId: dbUser.id, // ✅ correct ObjectId
    });

    revalidatePath("/dashboard");
    return JSON.parse(JSON.stringify(playground));

  } catch (error) {
    console.error("createPlayground error:", error);
    throw error;
  }
};

/**
 * Delete playground
 */
export const deleteProjectById = async (id) => {
  try {
    await connectToDatabase();

    await Playground.findByIdAndDelete(id);

    revalidatePath("/dashboard");
    return { deleted: true };
  } catch (error) {
    console.error("deleteProjectById error:", error);
    return { deleted: false };
  }
};

/**
 * Edit playground
 */
export const editProjectById = async (id, data) => {
  try {
    await connectToDatabase();

    const updated = await Playground.findByIdAndUpdate(
      id,
      {
        title: data.title,
        description: data.description,
      },
      { new: true }
    );

    revalidatePath("/dashboard");
    return updated;
  } catch (error) {
    console.error("editProjectById error:", error);
    throw error;
  }
};

/**
 * Duplicate playground
 */
export const duplicateProjectById = async (id) => {
  try {
    await connectToDatabase();

    const original = await Playground.findById(id).lean();
    if (!original) throw new Error("Playground not found");

    const duplicated = await Playground.create({
      title: `${original.title} (Copy)`,
      description: original.description,
      template: original.template,
      userId: original.userId || null,
    });

    revalidatePath("/dashboard");
    return duplicated;
  } catch (error) {
    console.error("duplicateProjectById error:", error);
    throw error;
  }
};

/**
 * Toggle star mark (NO AUTH)
 */
export const toggleStarMarked = async (playgroundId, isChecked, userId) => {
  try {
    await connectToDatabase();

    if (isChecked) {
      await StarMark.findOneAndUpdate(
        { userId, playgroundId },
        { isMarked: true },
        { upsert: true }
      );
    } else {
      await StarMark.findOneAndDelete({ userId, playgroundId });
    }

    revalidatePath("/dashboard");

    return { success: true, isMarked: isChecked };
  } catch (error) {
    console.error("toggleStarMarked error:", error);
    return { success: false };
  }
};
