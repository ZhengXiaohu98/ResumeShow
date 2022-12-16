import axios from "axios"
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })


/************************************
*        CREATE POST API            *
* This api will add a new resume    *
************************************/
export const createPost = async (postData) => {
  let returnData = {};
  try {
    await API.post("/posts", postData).then(
      (res) => returnData = res
    )
  } catch (error) {
    console.log(error)
  }
  return returnData;
}

/***********************************************
*                 CREATE POST API              *
* This api get all the resumes by the users id *
***********************************************/
export const getPost = async (id) => {
  let returnData = {};
  try {
    await API.get("/posts/post/" + id, { withCredentials: true }).then(
      (res) => returnData = res
    )
  } catch (error) {
    console.log(error)
  }
  return returnData;
}


/********************************
*          GET POST API         *
* This api get all the resumes  *
********************************/
export const getAllPost = async () => {
  let returnData = {};
  try {
    await API.get("/posts/allposts").then((res) => {
      returnData = res
    })
  } catch (error) {
    console.log(error)
  }
  return (returnData)
}

// ========================= Home Page: =========================

/****************************************************************************
*                                   LIKE APIS                               *
* These two api will add/remove the user from the like array of the resume  *
****************************************************************************/
export const postLike = async (resumeId, userId) => {
  try {
    return API.get("/posts/like/" + resumeId + "?userId=" + userId, { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}
export const postDislike = async (resumeId, userId) => {
  try {
    return API.get("/posts/dislike/" + resumeId + "?userId=" + userId, { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}

// api update resume(comment)
export const updateResumeComment = async (resumeId, userId, content) => {
  return API.get("/posts/addcomment/" + resumeId + "?userId=" + userId + "&content=" + content, { withCredentials: true })
}

/****************************************************************************
*                                   STAR APIS                               *
* These two api will add/remove the user from the star array of the resume  *
****************************************************************************/
export const postStar = async (resumeId, userId) => {
  try {
    return API.get("/posts/star/" + resumeId + "?userId=" + userId, { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}
export const postUnStar = async (resumeId, userId) => {
  try {
    return API.get("/posts/unstar/" + resumeId + "?userId=" + userId, { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}


//======================================== post page ==============================

//view all current user's posts
export const getAllMyPosts = async (id) => {
  console.log("start request all posts")
  var returnData = {};
  try {
    await API.get("/posts/myposts/" + id).then((res) => {
      returnData = res
    })
  } catch (error) {
    console.log("get all catch error:")
    console.log(error)
  }
  return (returnData)

}

//delete a selected post that belong to the current user
export const deleteMyPosts = async (id) => {
  var returnData = {};
  try {
    await API.delete("/posts/deletePost/" + id).then((res) => {
      returnData = res
    })
  } catch (error) {
    console.log("get all catch error:")
    console.log(error)
  }
  return (returnData)
}

//view all current user's likes
export const getAllMyLikes = async (id) => {
  var returnData = {};
  try {
    await API.get("/posts/getMyLike/" + id).then((res) => {
      returnData = res
    })
  } catch (error) {
    console.log("get all catch error:")
    console.log(error)
  }
  return (returnData)
}

//view all current user's Stars
export const getAllMyStar = async (id) => {
  var returnData = {};
  try {
    await API.get("/posts/getMyStar/" + id).then((res) => {
      returnData = res
    })
  } catch (error) {
    console.log("get all catch error:")
    console.log(error)
  }
  return (returnData)
}


// delete a liked post on post page
export const deleteLike = async (resumeId, userId) => {
  var returnData = {};
  try {
    await API.put("/posts/deleteLike/" + resumeId + "/" + userId, { withCredentials: true }).then(
      (res) => { returnData = res }
    )
  } catch (err) {
    console.log(err)
  }
  return (returnData)
}

// delete a Star post on post page
export const deleteStar = async (resumeId, userId) => {
  var returnData = {};
  try {
    await API.put("/posts/deleteStar/" + resumeId + "/" + userId, { withCredentials: true }).then(
      (res) => { returnData = res }
    )
  } catch (err) {
    console.log(err)
  }
  return (returnData)
}

