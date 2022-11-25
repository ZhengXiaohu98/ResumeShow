import mongoose from "mongoose";

 const PostSchema = mongoose.Schema(

    {
        userId:{
            type: String,
            required: true
        },

        title: String,

        description: String,

        file: String,

        isLookForJobs: {
          type: Boolean,
          default: false
        },

        major: {
          type: String,
          default: "None"
        },

        resumeBlocks: [],

        likes:[],

        stars:[],

        //list of comments id
        comments: []

    },
    {timestamps: true}

 )



const PostModel = mongoose.model("Post", PostSchema)

export default PostModel;














