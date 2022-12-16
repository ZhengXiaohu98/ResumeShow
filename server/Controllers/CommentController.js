import PostModel from "../Models/postModel.js";
import CommentModel from "../Models/commentModel.js"
import mongoose from "mongoose";

/***********************************************************
*              GET COMMENT API                             *
* This api will get all the comments for a specifc resume  *
************************************************************/
export const getComment = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await PostModel.findById(postId);
    const commentList = post.comments;
    const commentListMongo = commentList.map((commentID) => { return mongoose.Types.ObjectId(commentID) })

    const CommentsWithUsername = await CommentModel.aggregate([
      {
        $match: {
          _id: { $in: commentListMongo }
        }
      },

      {
        $lookup: {
          from: "users",

          let: { "searchId": "$userId" },
          "pipeline": [
            { "$match": { "$expr": { "$eq": [{ $toString: "$_id" }, "$$searchId"] } } },
            { "$project": { "username": 1, } }
          ],
          as: "user"
        }
      },
    ])
    res.status(200).json(CommentsWithUsername);
  } catch (err) {
    res.status(500).json(err);
  }
}


/********************************************************
*              ADD COMMENT API                          *
* This api will add a new comment for a specifc resume  *
*********************************************************/
export const createComment = async (req, res) => {
  const postId = req.params.id;
  const newComment = CommentModel(req.body);

  try {
    await newComment.save();
    const commentID = newComment._id

    await PostModel.updateOne(
      { _id: postId },
      { $push: { comments: commentID } }
    );

    const CommentWithUsername = await CommentModel.aggregate([
      {
        $match: {
          _id: newComment._id
        }
      },

      {
        $lookup: {
          from: "users",

          let: { "searchId": "$userId" },
          "pipeline": [
            { "$match": { "$expr": { "$eq": [{ $toString: "$_id" }, "$$searchId"] } } },
            { "$project": { "username": 1, } }
          ],
          as: "user"
        }
      },
    ])
    res.status(200).json(CommentWithUsername);

  } catch (err) {
    res.status(500).send("Something went wrong, check logs");
  }
}
















