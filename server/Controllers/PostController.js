import PostModel from "../Models/postModel.js";
import CommentModel from "../Models/commentModel.js"
import UserModel from "../Models/userModel.js"


// user create a post
export const createPost = async (req, res) => {

  const newPost = PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json({ newPost })
  } catch (error) {
    res.status(500).json(error)
  }

}

// get single post by given id
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

//get all user's post
export const getAllPost = async (req, res) => {

  try {
    const posts = await PostModel.find();
    res.status(200).json(posts)
    //res.send(post)
  } catch (error) {
    res.status(500).json(error)
  }
}


// get all posts of a specific user using id
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





//====================== like operation =====================================

//like a post
export const updatePostLike = async (req, res) => {
  const id = req.params.id;
  const userId = req.url.substr(req.url.indexOf('?') + 8);
  try {
    const result = await PostModel.updateOne(
      { _id: id },
      { $push: { likes: userId } }
    )


    //add the post to user's like list:
    await UserModel.updateOne(
      { _id: userId },
      { $push: { myLikes: id } }
    )


    // return res.status(200)
    res.status(200).json("like the post: "+ id);

  } catch (err) {
    console.log(err)
    res.status(500).json(err);

  }
}


// dislike a post
export const updatePostDislike = async (req, res) => {
  const id = req.params.id;
  const userId = req.url.substr(req.url.indexOf('?') + 8);
  try {
    const result = await PostModel.updateOne(
      { _id: id },
      { $pull: { likes: userId } }
    )
    //rm the post to user's like list:
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { myLikes: id } }
    )
    // return res.status(204);
    res.status(200).json("dislike the post: "+ id);

  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}

// get a user's like list
export const getMyLikes = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);
    var result = []
    for (const postID of user.myLikes) {
      const post = await PostModel.findById(postID);
      result.push(post)
    }

    res.status(200).json(
      result.
        sort((a, b) => { //sort the timeline in descending order
          return b.createdAt - a.createdAt
        })
    )

  } catch (err) {
    res.status(500).send(err);
  }

}


// delete a like in post page
export const deleteLike = async (req, res) => {
  const userId = req.params.userID;
  const postId = req.params.id;

  try {
    await PostModel.updateOne(
      { _id: postId },
      { $pull: { likes: userId } }    )

    //rm the post to user's like list:
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { myLikes: postId } })

    res.status(200).json("dislike the post: "+ postId);
  } catch (err) {
    res.status(500).json(err);
  }
}




//====================== star operation =====================================

export const updatePostStar = async (req, res) => {
  const id = req.params.id;
  const userId = req.url.substr(req.url.indexOf('?') + 8);
  try {
    const result = await PostModel.updateOne(
      { _id: id },
      { $push: { stars: userId } }
    )

    //add the post to user's like list:
    await UserModel.updateOne(
      { _id: userId },
      { $push: { myStars: id } }
    )
    res.status(200).json("Star the post: "+ id);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
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

    //rm the post to user's like list:
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { myStars: id } }
    )
    res.status(200).json("Un-Star the post: "+ id);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
}



// get a user's star list
export const getMyStar = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UserModel.findById(userId);
    var result = []
    for (const postID of user.myStars) {
      const post = await PostModel.findById(postID);
      result.push(post)
    }

    res.status(200).json(
      result.
        sort((a, b) => { //sort the timeline in descending order
          return b.createdAt - a.createdAt
        })
    )

  } catch (err) {
    res.status(500).send(err);
  }

}

// delete a star in post page
export const deleteStar = async (req, res) => {
  const userId = req.params.userID;
  const postId = req.params.id;

  try {
    await PostModel.updateOne(
      { _id: postId },
      { $pull: { stars: userId } }    )

    //rm the post to user's like list:
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { myStars: postId } })

    res.status(200).json("Un-Star the post: "+ postId);
  } catch (err) {
    res.status(500).json(err);
  }
}


//================================  comment operation=====================================================

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
      { $push: { comments: newComment._id.toString() } }
    );
    return res.status(200)
  } catch (err) {
    res.status(500).send("Something went wrong, check logs");
  }
}







//delete a post
export const deletePost = async (req, res) => {
  const targetPostId = req.params.id;

  try {
    const post = await PostModel.findById(targetPostId);

    //delete this post from myLikes[] of each user who clicks like
    const likedUsersID = post.likes;
    if (likedUsersID.length > 0) {
      for (const userID of likedUsersID) {
        var likedUser = await UserModel.findById(userID);
        if (likedUser.myLikes) {
          // likedUser.myLikes = likedUser.myLikes.filter(item => item !== targetPostId)
          // await likedUser.save();

          await likedUser.updateOne({ $pull: { myLikes: targetPostId } })
        }
      }
    }

    //delete this post from myStars[] of each user who clicks like
    const starUsersID = post.stars;
    if (starUsersID.length > 0) {
      for (const userID of starUsersID) {
        var starUser = await UserModel.findById(userID);
        if (starUser.myStars) {
          // starUser.myStars = starUser.myStars.filter(item => item !== targetPostId)
          // await starUser.save();

          await starUser.updateOne({ $pull: { myStars: targetPostId } })
        }
      }
    }

    //delete all comment:
    const allCommentIDs = post.comments;
    if (allCommentIDs.length > 0) {
      for (const commentID of allCommentIDs) {
        await CommentModel.findByIdAndDelete(commentID);
      }
    }

    //delete the post from user's posts array (the createPost didnt add post id to myPosts, so put this as comment)
    // const ownerID = post.userId;
    // var owner = await UserModel.findById(ownerID);
    // console.log(owner)
    // console.log("before removing")
    // console.log(owner.myPosts)
    // await owner.updateOne({$pull: {myPosts: targetPostId}})
    // console.log("after removing")
    // console.log(owner.myPosts)

    //delete post itself:
    await PostModel.findByIdAndDelete(targetPostId)

    res.status(200).json("post deleted.")
  } catch (error) {
    res.status(500).json(error)
  }
}
