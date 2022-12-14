import { useState } from 'react'

import "./Auth.css"
import * as AuthAPI from "../../../API/AuthRequest.js"

import { Link } from "react-router-dom";

import background from "./background.jpg";
import google from "./google.svg";
import github from './github-mark.svg'


const Auth = () => {

  /*************************************
  *        GOOGLE AUTHENTICATION       *
  *************************************/
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

  /*************************************
  *        GITHUB AUTHENTICATION       *
  **************************************/
  const githubAuth = () => {
    try {
      window.open(
        `${process.env.REACT_APP_API_URL}/auth/github/callback`,
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
  const [badInfo, setBadInfo] = useState(0);

  const checkForm = () => {
    if (data.username.length === 0) {
      setBadInfo(1)
      return false;
    }
    else if ((data.password.length === 0)) {
      setBadInfo(2)
      return false;
    }
    return true;
  }

  const changeData = (e) => {
    setData(
      { ...data, [e.target.name]: e.target.value }
    )
  }

  /******************************
  *        REGULAR SIGNIN       *
  *******************************/
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (checkForm()) {
      const res = await AuthAPI.logIn(data)
      console.log(res)
      try {
        if (typeof res.request == 'undefined') {
          // bad username or passward
          setBadInfo(3)
        } else {
          if (res.request.status == "200") {
            // save token
            console.log(11)

            localStorage.setItem("token", res.data.token)
            window.open(process.env.REACT_APP_URL, "_self");
          }
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  //==========================================================================================
  return (
    <div className="auth">

      <div className="authContainer">
        <img id='backGround' src={background} alt="" />

        {/* <div className="signIn"> */}
        <form className="infoForm authform">
          <span className='authTitle'>User Login</span>

          <span className='authDesc'>Enter your data to get sign in to your account</span>

          {badInfo == 1 &&
            <span className='authDesc failAuth'>Username cannot be empty!</span>
          }
          {badInfo == 2 &&
            <span className='authDesc failAuth'>Password cannot be empty!</span>
          }
          {badInfo == 3 &&
            <span className='authDesc failAuth'>Invalid Username or Wrong Password</span>
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
              <img src={github} alt='' class="logoIcon" />
              <button className='button logoBtn' onClick={githubAuth}>
                GitHub
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth
