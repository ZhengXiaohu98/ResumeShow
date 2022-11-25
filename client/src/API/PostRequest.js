import axios from "axios"

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })

export const createPost = async (postData) => {

    var returnData = {};
    try {
        const { data } = await API.post("/posts", postData).then(
            (res)=> returnData = res
        )

    } catch (error) {
        console.log(error)
    }

     return returnData;

}


export const getPost = async (id) => {
    try {
        const { data } = API.get("/posts/post" + id, { withCredentials: true })
        return data;
    } catch (error) {
        console.log(error)
    }

}


export const getAllPost = async () => {
    console.log("start request all posts")
    var returnData = {};
    try {
        await API.get("/posts/allposts").then((res) => {
            returnData = res
        })
        console.log("Request all posts SUCCESS.")

    } catch (error) {
        console.log("get all catch error:")
        console.log(error)
    }
    return (returnData)
}


export const getAllMyPosts = async (id) => {
    console.log("start request all posts")
    var returnData = {};
    try {
        await API.get("/posts/myposts/"+id).then((res) => {
            returnData = res
        })
    } catch (error) {
        console.log("get all catch error:")
        console.log(error)
    }
    return (returnData)

}


// api update resume(like)
export const updateResumeLike = async (resumeId, userId, likeList) => {
  try {
    if(likeList.includes(userId)) {
      return API.get("/posts/dislike/"+resumeId+"?userId="+userId, { withCredentials: true })
    }
    return API.get("/posts/like/"+resumeId+"?userId="+userId, { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}

// api update resume(comment)
export const updateResumeComment = async (resumeId, userId, content) => {
  return API.get("/posts/addcomment/"+resumeId+"?userId="+userId+"&content="+content, { withCredentials: true })
}

// api update resume(stars)
export const updateResumeStar = async (resumeId, userId, starList) => {
  try {
    if(starList.includes(userId)) {
      return API.get("/posts/unstar/"+resumeId+"?userId="+userId, { withCredentials: true })
    }
    return API.get("/posts/star/"+resumeId+"?userId="+userId, { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}