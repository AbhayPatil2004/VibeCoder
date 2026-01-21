import mongoose, { model, models } from 'mongoose'

const playgroundSchema = new mongoose.Schema({

    title : {
        type : String ,
        required: true,
    },
    description : {
        type : String 
    },
    template : {
        type : String ,
        enum: ["REACT", "NEXTJS", "EXPRESS", "VUE", "HONO", "ANGULAR"],
        default : "REACT"
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User",
        required : true
    }
} , {
    timestamps : true 
})

const Playground = models.Playground || model("Playground" , playgroundSchema )

export default Playground