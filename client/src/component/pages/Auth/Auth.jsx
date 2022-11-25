import { useState } from 'react'

import "./Auth.css"
import * as AuthAPI from "../../../API/AuthRequest.js"
import axios from "axios"

import { Routes, Route, Navigate, Link } from "react-router-dom";

import background from "./background.jpg";
import google from "./google.svg";
import facebook from "./facebook.svg";



const Auth = () => {

  const googleAuth = () => {
    try {
      window.open(
        `${process.env.REACT_APP_API_URL}/auth/google/callback`,
        "_self"
      );
    } catch (error) {
      console.log("Auth page, open oauth...  \n" + error)
    }
  };

  const facebookAuth = () => {
    try {
      window.open(
        `${process.env.REACT_APP_API_URL}/auth/facebook/callback`,
        "_self"
      );
    } catch (error) {
      console.log("Auth page, open oauth...  \n" + error)
    }
  };

  const initData = {
    username: "",
    password: "",
  }

  const [data, setData] = useState(initData);

  // check if the user's username or passward is an invalid input
  const [badInfo, setBadInfo] = useState(false);

  const changeData = (e) => {
    setData(
      { ...data, [e.target.name]: e.target.value }
    )
  }



  const handleSubmit = async (e) => {
    e.preventDefault()

    const response = await AuthAPI.logIn(data)

    try {
      //if result is undefined, invalid password or username
      var loginResult = response.request
      if (typeof loginResult === 'undefined') {
        // bad username or passward
        setBadInfo(true)
      } else { //check if status is 200, if so, go to home page
        loginResult = response.request.status
        if (loginResult == "200") {
          // this.setState({ user: response.data })
          window.open("http://localhost:3000", "_self");
        }
      }
    } catch (err) {
      console.log(err)
    }

  }


  return (
    <div className="auth">

      <div className="authContainer">
        <img id='backGround' src={background} alt="" />

        {/* <div className="signIn"> */}
        <form className="infoForm authform">
          <span className='authTitle'>User Login</span>
          
          {badInfo?
            <span className='authDesc failAuth'>Invalid Username or Wrong Password</span> :
            <span className='authDesc'>Enter your data to get sign in to your account</span>
          }

          <div className='infoInputWraper'>
            <input required
              type="text"
              className="infoInput"
              placeholder=' Username'
              name='username'
              value={data.username}
              onChange={changeData}
            />
          </div>

          <div className='infoInputWraper'>
            <input required

              type="password"
              className="infoInput"
              placeholder=' Password'
              name='password'
              value={data.password}
              onChange={changeData}
            />
          </div>

          <span className='trouble'>
            <Link className='trouble' to="/signup">Don't have account? Sign Up!</Link>
          </span>

          <button className='button infoButton'
            type='Submit'
            onClick={handleSubmit}>
            Sign in
          </button>

          <hr class="hr-mid-circle" />


          <span className='signOptions'>Or Sign in with</span>

          <div className="buttonWrapper">
            <div className="logoWrapper">

              <img src={google} alt='' class="logoIcon" />
              <button className='button logoBtn' onClick={googleAuth}>
                Google
              </button>
            </div>

            <div className="logoWrapper">
              <img src={facebook} alt='' class="logoIcon" />
              <button className='button logoBtn' onClick={facebookAuth}>
                Facebook
              </button>
            </div>

          </div>


        </form>

        {/* </div> */}

        {/* <Footer/> */}

      </div>
    </div>
  )
}

export default Auth

//<a target="_blank" href="https://icons8.com/icon/60984/google">Google</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
