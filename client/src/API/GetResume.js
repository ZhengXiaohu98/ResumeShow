import axios from "axios"

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })

/************************************
*        GET RESUME API             *
* This api will get all the resumes *
************************************/
export const getAllResume = async () => {
  try {
    return API.get("/getresume/all", { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}

/****************************************************
*         GET RESUME API WITH FILTER                *
* This api will take a filter list then get resumes *
*****************************************************/
export const getFiltedResume = async (filterMajorList) => {
  try {
    let param = filterMajorList.join(',')
    return API.get("/getresume/filtermajor?majors="+param, { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}