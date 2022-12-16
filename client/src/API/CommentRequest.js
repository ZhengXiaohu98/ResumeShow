import axios from "axios"
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })

/*********************************************************
*                 GET COMMENTS API                       *
* This api will get all the comments for a specific post *
**********************************************************/
export const getComments = async (postId) => {
  let returnData = {};
  try {
    await API.get("/comments/getComment/" + postId, { withCredentials: true }).then(
      (res) => returnData = res
    )
  } catch (err) {
    console.log(err)
  }
  return returnData;
}

/*********************************************************
*                 CREATE COMMENTS API                    *
* This api will add a comment to a specific resume post  *
**********************************************************/
export const CreateComment = async (postId, commetData) => {
  let returnData = {};
  try {
    await API.post("/comments/newComment/" + postId, commetData, { withCredentials: true }).then(
      (res) => returnData = res
    )
  } catch (err) {
    console.log(err)
  }
  return returnData;
}