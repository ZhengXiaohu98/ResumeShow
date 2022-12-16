import axios from "axios"
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })

/************
* LOGIN API *
*************/
export const logIn = async (formData) => {
  let returnRes = {} // holds for return result
  let options = { withCredentials: true }
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = {
      'Authorization': `Bearer ${token}`
    }
  }
  try {
    await API.post(
      '/auth/login',
      formData,
      options
    ).then((res) => {
      returnRes = res
    })
  } catch (error) {
    console.log(error)
  }
  return (returnRes)
}

/*************
* SIGNIN API *
**************/
export const signUp = (formData) => API.post(
  '/auth/register',
  formData,
  { withCredentials: true })
  .then((res) => { console.log(res); return res; })