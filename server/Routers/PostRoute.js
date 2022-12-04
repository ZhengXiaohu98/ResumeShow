import express from "express";
import * as Post from "../Controllers/PostController.js"



const router = express();

// create new post
router.post("/", Post.createPost)

//get post 
router.get("/post/:id", Post.getPost)
router.get("/allposts", Post.getAllPost)
router.get("/myposts/:id", Post.getAllMyPosts)

//like operation: 
router.get("/like/:id", Post.updatePostLike)    //put
router.get("/dislike/:id", Post.updatePostDislike)  //put
router.get("/getMyLike/:id", Post.getMyLikes)
router.put("/deleteLike/:id/:userID", Post.deleteLike)

// comment:
router.get("/addcomment/:id", Post.addPostComment)

//star:
router.get("/star/:id", Post.updatePostStar)
router.get("/unstar/:id", Post.updatePostUnstar)
router.get("/getMyStar/:id", Post.getMyStar)
router.put("/deleteStar/:id/:userID", Post.deleteStar)


//delete operation
router.delete("/deletePost/:id", Post.deletePost)



export default router;

