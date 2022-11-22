import express from "express";
import * as Post from "../Controllers/PostController.js"



const router = express();


router.post("/", Post.createPost)
router.get("/post/:id", Post.getPost)


router.get("/allposts", Post.getAllPost)
router.get("/myposts/:id", Post.getAllMyPosts)

router.get("/like/:id", Post.updatePostLike)
router.get("/dislike/:id", Post.updatePostDislike)

router.get("/addcomment/:id", Post.addPostComment)

router.get("/star/:id", Post.updatePostStar)
router.get("/unstar/:id", Post.updatePostUnstar)


export default router;

