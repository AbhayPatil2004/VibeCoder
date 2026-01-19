"use server"

import { auth } from "../../../auth.js"

import { db } from "../../../lib/db.js"



export const getUserById = async (id) => {
    try {
        const user = await db.user.findUnique({
            where: { id },
            include: {
                accounts: true
            }
        })

        return user
    }
    catch (error) {
        console.log(error)
        return null
    }
}

export const getAccountByUserId = async (userId) => {

    try {
        const account = await db.account.findFirst({
            where : {
                userId
            }
        })

        return account
    }   
    catch (error) {
        console.log(error)
        return null
    }
}

export const currentUser = async() => {
    const user = await auth()
    return user?.user 
}