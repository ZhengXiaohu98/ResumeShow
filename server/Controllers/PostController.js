import PostModel from "../Models/postModel.js";
import CommentModel from "../Models/commentModel.js"
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
  try {
    const result = await PostModel.find({ userId: id })
    res.status(200).json(
      result.
        sort((a, b) => { //sort the timeline in descending order
          return b.createdAt - a.createdAt
        })
    )
  } catch (err) {
    res.status(500).send("Something went wrong, check logs");
  }
}

export const updatePostLike = async (req, res) => {
  const id = req.params.id;
  const userId = req.url.substr(req.url.indexOf('?') + 8);
  try {
    const result = await PostModel.updateOne(
      { _id: id },
      { $push: { likes: userId } }
    )
    return res.status(200)

  } catch (err) {
    res.status(500).send("Something went wrong, check logs");
  }
}


export const updatePostDislike = async (req, res) => {
  const id = req.params.id;
  const userId = req.url.substr(req.url.indexOf('?') + 8);
  try {
    const result = await PostModel.updateOne(
      { _id: id },
      { $pull: { likes: userId } }
    )
    return res.status(204);
  } catch (err) {
    res.status(500).send("Something went wrong, check logs");
  }
}

export const updatePostStar = async (req, res) => {
  const id = req.params.id;
  const userId = req.url.substr(req.url.indexOf('?') + 8);
  try {
    const result = await PostModel.updateOne(
      { _id: id },
      { $push: { stars: userId } }
    )
    return res.status(200)

  } catch (err) {
    res.status(500).send("Something went wrong, check logs");
  }
}

export const updatePostUnstar = async (req, res) => {
  const id = req.params.id;
  const userId = req.url.substr(req.url.indexOf('?') + 8);
  try {
    const result = await PostModel.updateOne(
      { _id: id },
      { $pull: { stars: userId } }
    )
    return res.status(200)

  } catch (err) {
    res.status(500).send("Something went wrong, check logs");
  }
}


export const addPostComment = async (req, res) => {
  const id = req.params.id;
  const paramsStr = req.url.substr(req.url.indexOf('?') + 1);
  let params = paramsStr.split('&')
  let mp = new Map()
  for (let param of params) {
    mp.set(param.substring(0, param.indexOf('=')), param.substr(param.indexOf('=') + 1));
  }

  // making a new comment
  const newComment = new CommentModel({
    userId: mp.get("userId"),
    desc: mp.get("content"),
    postId: id
  });
  try {
    await newComment.save();
    await PostModel.updateOne(
        { _id: id },
        { $push: { comments: newComment._id } }
      );
    return res.status(200)
  } catch (err) {
    res.status(500).send("Something went wrong, check logs");
  }
}