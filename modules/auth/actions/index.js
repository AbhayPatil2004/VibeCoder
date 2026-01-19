"use server";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Account from "@/models/Account";

/**
 * Get user by ID (with accounts populated)
 */
export const getUserById = async (id) => {
  try {
    await connectToDatabase();

    const user = await User.findById(id)
      .populate("accounts") // replaces `include: { accounts: true }`
      .lean();

    return user;
  } catch (error) {
    console.error("getUserById error:", error);
    return null;
  }
};

/**
 * Get account by userId
 */
export const getAccountByUserId = async (userId) => {
  try {
    await connectToDatabase();

    const account = await Account.findOne({ userId }).lean();

    return account;
  } catch (error) {
    console.error("getAccountByUserId error:", error);
    return null;
  }
};

/**
 * Get current authenticated user (NextAuth)
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user || null;
};
