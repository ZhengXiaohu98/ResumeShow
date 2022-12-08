import express from "express";
import * as Comment from "../Controllers/CommentController.js"



const router = express();

//get all comment of related to a post
router.get("/getComment/:id", Comment.getComment)


router.post("/newComment/:id", Comment.createComment)






export default router;


