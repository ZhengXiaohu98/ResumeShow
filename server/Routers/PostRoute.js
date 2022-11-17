import express from "express";
import * as Post from "../Controllers/PostController.js"



const router = express();


router.post("/", Post.createPost)
router.get("/post/:id", Post.getPost)


router.get("/allposts", Post.getAllPost)
router.get("/myposts/:id", Post.getAllMyPosts)





export default router;

