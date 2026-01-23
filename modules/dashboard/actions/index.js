"use server";

import { revalidatePath } from "next/cache";
import connectToDatabase from "@/lib/db";
import Playground from "@/models/Playground";
import User from "@/models/User";
import { currentUser } from "@/modules/auth/actions";

/**
 * Get all playgrounds of logged-in user
 */
export const getAllPlayground = async () => {
    try {
        await connectToDatabase();

        const sessionUser = await currentUser();
        if (!sessionUser?.email) return [];

        const dbUser = await User.findOne({ email: sessionUser.email }).lean();
        if (!dbUser) return [];

        const playgrounds = await Playground.find({ userId: dbUser._id })
            .sort({ createdAt: -1 })
            .populate("userId", "name image email") // ✅ populate user
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


    }
    catch (error) {
        console.error("getAllPlayground error:", error);
        return [];
    }
};

/**
 * Create playground
 */
export const createPlayground = async (data) => {
    try {
        await connectToDatabase();

        const sessionUser = await currentUser();
        if (!sessionUser?.email) throw new Error("Unauthorized");

        const dbUser = await User.findOne({ email: sessionUser.email });
        if (!dbUser) throw new Error("User not found");

        const playground = await Playground.create({
            title: data.title,
            description: data.description,
            template: data.template,
            userId: dbUser._id,
        });

        return playground;
    } catch (error) {
        console.error("createPlayground error:", error);
        throw error;
    }
};

/**
 * Delete playground by ID
 */
export const deleteProjectById = async (id) => {
    try {
        await connectToDatabase();

        const sessionUser = await currentUser();
        if (!sessionUser?.email) throw new Error("Unauthorized");

        // Authenticated user only (no ownership validation)
        const deletedPlayground = await Playground.findByIdAndDelete(id);

        if (!deletedPlayground) {
            throw new Error("Playground not found");
        }

        revalidatePath("/dashboard");

        return { deleted: true };
    } catch (error) {
        console.error("deleteProjectById error:", error);
        return { deleted: false };
    }
};

/**
 * Edit playground by ID
 */
export const editProjectById = async (id, data) => {
    try {
        await connectToDatabase();

        const sessionUser = await currentUser();
        if (!sessionUser?.email) throw new Error("Unauthorized");

        const updatedPlayground = await Playground.findByIdAndUpdate(
            id,
            {
                title: data.title,
                description: data.description,
            },
            { new: true }
        );

        if (!updatedPlayground) {
            throw new Error("Playground not found");
        }

        revalidatePath("/dashboard");

        return updatedPlayground;
    } catch (error) {
        console.error("editProjectById error:", error);
        throw error;
    }
};

/**
 * Duplicate playground by ID
 */
export const duplicateProjectById = async (id) => {
    try {
        await connectToDatabase();

        const sessionUser = await currentUser();
        if (!sessionUser?.email) throw new Error("Unauthorized");

        const originalPlayground = await Playground.findById(id).lean();
        if (!originalPlayground) {
            throw new Error("Original playground not found");
        }

        const duplicatedPlayground = await Playground.create({
            title: `${originalPlayground.title} (Copy)`,
            description: originalPlayground.description,
            template: originalPlayground.template,
            userId: originalPlayground.userId, // keeps same owner
        });

        revalidatePath("/dashboard");

        return duplicatedPlayground;
    } catch (error) {
        console.error("duplicateProjectById error:", error);
        throw error;
    }
};

export const toggleStarMarked = async (playgroundId, isChecked) => {
  await dbConnect();

  const user = await currentUser();
  const userId = user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    if (isChecked) {
      // create OR update safely
      await StarMark.findOneAndUpdate(
        { userId, playgroundId },
        { isMarked: true },
        { upsert: true, new: true }
      );
    } else {
      await StarMark.findOneAndDelete({
        userId,
        playgroundId,
      });
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      isMarked: isChecked,
    };
  } catch (error) {
    console.error("Error updating star mark:", error);
    return {
      success: false,
      error: "Failed to update star mark",
    };
  }
};
