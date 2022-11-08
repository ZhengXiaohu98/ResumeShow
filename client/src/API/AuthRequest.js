import axios from "axios"

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL })

// export const googleAuth = async ({ profileObj }) => {
//   axios({
//     method: "post",
//     url: "/auth/google/signin",
//     data: {
//       googleId: profileObj.googleId,
//       email: profileObj.email,
//     },
//   })
//     .then((res) => console.log(res.data))
//     .catch((err) => console.log(err));
// };



//export const logIn = 
// export const logIn = async (formData) => {
//   await API.post(
//     '/auth/login',
//     formData,
//     {withCredentials: true}
//   ).then( (res)=> {
//     console.log("API request: login");
//     // console.log(res);
//     console.log(res.request.status)
//     //return [res, res.request.status];
//     return res;
//   })
// }

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

