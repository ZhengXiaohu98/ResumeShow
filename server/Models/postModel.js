import mongoose from "mongoose";

 const PostSchema = mongoose.Schema(

    {
        userId:{
            type: String,
            required: true
        },
        description: String,

        resume: String,

        resumeBlocks: [],

        likes:[],

        comments: []

    },
    {timestamps: true}

 )



const PostModel = mongoose.model("Post", PostSchema)

export default PostModel;














