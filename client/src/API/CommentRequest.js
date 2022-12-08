import axios from "axios"

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })


export const getComments = async(postId) => {
    var returnData = {};

    try {

        await API.get("/comments/getComment/"+postId, { withCredentials: true }).then(
            (res)=> returnData = res
        )

    } catch (error) {
        console.log(error)
    }

    return returnData;
}



export const CreateComment = async(postId, commetData) => {
    var returnData = {};

    try {

        await API.post("/comments/newComment/"+postId, commetData, { withCredentials: true }).then(
            (res)=> returnData = res
        )

    } catch (error) {
        console.log(error)
    }
    return returnData;
}