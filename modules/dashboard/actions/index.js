"use server"
import { currentUser } from '../../auth/actions/index.js'
import Playground from '../../../models/Playground.js'
import User from '../../../models/User.js'

export const getAllPlayground =  async () => {

    try{
        
        const sessionUser = await currentUser()

        if( !sessionUser ) return []

        const dbUser = await User.findOne({
            authUserId : sessionUser.id 
        })

        if( !dbUser ) return []

        const playgrounds = await Playground.find({
            userId : dbUser._id ,
        }).sort({ createdAt : -1})

        return playgrounds;
    }
    catch(error){
        console.log(error)
    }
}