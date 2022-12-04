import mongoose from"mongoose";


const UserSchema = mongoose.Schema(
    {
        username:{
            type: String,
            required: true
        },
        Email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        isAdmin:{
            type: Boolean,
            default: false
        },
        profilePicture: String,

        //used to store oauth info:
        provider: {
            type: String,
            default: null},
        providerProfile: {},
        providerUserId: {
            type: String,
            default: null},

        //list of post have submitted, arranged by last response time
        myPosts: [],

        myStars:[],
        myLikes:[]

    },

    {timestamps: true}

);

const userModel = mongoose.model("User", UserSchema);


export default userModel