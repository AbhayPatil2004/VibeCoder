"use server";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Account from "@/models/Account";

/**
 * ✅ Get user by NextAuth UUID (authUserId)
 */
export const getUserByAuthId = async (authUserId) => {
  try {
    if (!authUserId) return null;

    await connectToDatabase();

    return await User.findOne({ authUserId })
      .populate("accounts")
      .lean();
  } catch (error) {
    console.error("getUserByAuthId error:", error);
    return null;
  }
};

export const getUserByEmail = async (email) => {
  try {
    if (!email) return null;

    await connectToDatabase();
    return await User.findOne({ email }).lean();
  } catch (error) {
    console.error("getUserByEmail error:", error);
    return null;
  }
};


/**
 * ✅ Get account by Mongo user ObjectId
 */
export const getAccountByUserId = async (userObjectId) => {
  try {
    if (!userObjectId) return null;

    await connectToDatabase();

    return await Account.findOne({ userId: userObjectId }).lean();
  } catch (error) {
    console.error("getAccountByUserId error:", error);
    return null;
  }
};

/**
 * ✅ Get current authenticated user (NextAuth session)
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user || null;
};
