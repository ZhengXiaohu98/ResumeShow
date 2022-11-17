import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js"




export const createPost = async (req, res) => {

    const newPost = PostModel(req.body);

    try {
        await newPost.save();
        res.status(200).json({ newPost })
    } catch (error) {
        res.status(500).json(error)
    }

}



export const getPost = async (req, res) => {
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id);
        res.status(200).json(post)
        //res.send(post)
    } catch (error) {
        res.status(500).json(error)
    }
}


export const getAllPost = async (req, res) => {

    try {
        const posts = await PostModel.find();
        res.status(200).json(posts)
        //res.send(post)
    } catch (error) {
        res.status(500).json(error)
    }
}


export const getAllMyPosts = async (req, res) => {

    const id = req.params.id;

    // if (req.user && req.user._id==id) {

    try {
        const result = await PostModel.find({ userId: id })
        res.status(200).json(
            result.
                sort((a, b) => { //sort the timeline in descending order
                    return b.createdAt - a.createdAt
                })
        )
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong, check logs");
    }
    // }
    // else {
    //     res.status(500).send("You must log in to search more infomation.");

    // }
}







