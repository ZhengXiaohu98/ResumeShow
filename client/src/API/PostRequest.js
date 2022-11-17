import axios from "axios"

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })

export const createPost = async (postData) => {

    var returnData = {};
    try {
        const { data } = await API.post("/posts", postData).then(
            (res)=> returnData = res
        )
        // console.log("create post:")
        // console.log({data})
        // return {data}

    } catch (error) {
        console.log(error)
    }

     return returnData;

}


export const getPost = async (id) => {

    var returnData = {};
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

    // console.log("get all return data:")
    // console.log(returnData)
    return (returnData)

}


export const getAllMyPosts = async (id) => {
    console.log("start request all posts")
    var returnData = {};
    try {
        await API.get("/posts/myposts/"+id).then((res) => {
            returnData = res
        })
        console.log("Request all posts SUCCESS.")

    } catch (error) {
        console.log("get all catch error:")
        console.log(error)
    }

    // console.log("get all return data:")
    // console.log(returnData)
    return (returnData)

}
