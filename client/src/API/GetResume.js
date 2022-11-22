import axios from "axios"

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })

// api get all resume
export const getAllResume = async () => {
  try {
    return API.get("/getresume/all", { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}

export const getFiltedResume = async (filterMajorList) => {
  try {
    let param = filterMajorList.join(',')
    return API.get("/getresume/filtermajor?majors="+param, { withCredentials: true })
  } catch (err) {
    console.log(err)
  }
}