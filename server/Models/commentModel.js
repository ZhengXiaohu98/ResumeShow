import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(

    {
        userId:{
            type: String,
            required: true
        },

        desc: String,

        postId:{
            type: String,
            required: true
        }
        // to the post id
        //commentTo: string
    },    
    {timestamps: true}

)

const CommentModel = mongoose.model("Comment", CommentSchema)

export default CommentModel;

