import axios from "axios"

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })



export const logIn = async (formData) => {
  var returnData = {};
  try {
    await API.post(
      '/auth/login',
      formData,
      { withCredentials: true }
    ).then((res) => {
      returnData = res
    })
  } catch (error) {
    console.log(error)
  }


  // console.log(returnData)
  return (returnData)

}





export const signUp = (formData) => API.post(
  '/auth/register',
  formData,
  { withCredentials: true })
  .then((res) => { console.log(res); return res; })

