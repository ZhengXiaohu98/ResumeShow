import { useState } from 'react'
import "./Register.css"
import * as AuthAPI from "../../../API/AuthRequest.js"
import axios from "axios"
import { Routes, Route, Navigate, Link } from "react-router-dom";
import background from "../Auth/background.jpg";

const Register = () => {

    const initData = {
        Email: "",
        username: "",
        password: "",
        confirmPassword: ""
    }

    const [formData, setData] = useState(initData);

    const changeData = (e) => {
        setData(
            { ...formData, [e.target.name]: e.target.value }
        )
    }
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (checkForm()) {
            const response = await AuthAPI.signUp(formData)
            window.open(process.env.REACT_APP_URL, "_self");
        }
        // try {
        //     const response = await AuthAPI.signUp(formData)
        //     var { data } = response
        //     var { user } = data
        //     if(user){
        //         localStorage.setItem('user', JSON.stringify(user))
        //         window.open("http://localhost:3000", "_self");
        //     }
        // } catch (error) {
        //     console.log(error.response.data)
        // }



        // try {
        //     const loggedInUser = localStorage.getItem("user");
        //     if (loggedInUser) {
        //         const foundUser = JSON.parse(loggedInUser);
        //         console.log("now log found user");
        //         console.log(foundUser);
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    }



    const [badInfo, setBadInfo] = useState(0);
    const checkForm = () => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (formData.Email.length == 0) {
            setBadInfo(1)
            return false;
        }
        else if ( !re.test(formData.Email)){
            setBadInfo(6)
            return false;
        }
        if (formData.username.length == 0) {
            setBadInfo(2)
            return false;
        }
        else if ((formData.password.length == 0)) {
            setBadInfo(3)
            return false;
        }
        else if ((formData.confirmPassword.length == 0)) {
            setBadInfo(4)
            return false;
        }
        else if (formData.password !== formData.confirmPassword) {
            setBadInfo(5)
            return false;
        } 
        
        return true;
    }





    return (
        <div className="auth">

            <div className="authContainer">
                <img id='backGround' src={background} alt="" />



                <form className="infoForm authform">
                    <span className='authTitle' style={{ marginBottom: "10px" }}>User Signup</span>
                    <span className='authDesc' style={{ marginBottom: "7px" }}>Enter your infomation to create your own account!</span>

                    {badInfo == 1 &&
                        <span className='authDesc failAuth'>Email cannot be empty!</span>
                    }
                    {badInfo == 2 &&
                        <span className='authDesc failAuth'>Username cannot be empty!</span>
                    }
                    {badInfo == 3 &&
                        <span className='authDesc failAuth'>Password cannot be empty!</span>
                    }
                    {badInfo == 4 &&
                        <span className='authDesc failAuth' style={{width: "80%"}}>Please enter the confirmPassword!</span>
                    }
                    {badInfo == 5 &&
                        <span className='authDesc failAuth' style={{width: "80%"}}>Comfirm password is wrong. Confirm the Password again!</span>
                    }
                    {badInfo == 6 &&
                        <span className='authDesc failAuth'>Invalid E-mail form!</span>
                    }



                    <div className='infoInputWraper'>
                        <input
                            className="infoInput"
                            required
                            type="email"
                            placeholder='E-mail'
                            value={formData.Email}
                            name="Email"
                            onChange={changeData} />
                    </div>

                    <div className='infoInputWraper'>

                        <input
                            className="infoInput"
                            required
                            type="text"
                            placeholder='username'
                            value={formData.username}
                            name="username"
                            onChange={changeData} />
                    </div>


                    <div className='infoInputWraper'>

                        <input
                            className="infoInput"
                            required
                            type="password"
                            placeholder='password'
                            value={formData.password}
                            name="password"
                            onChange={changeData} />
                    </div>


                    <div className='infoInputWraper'>

                        <input
                            className="infoInput"
                            required
                            type="password"
                            placeholder='confirm password'
                            value={formData.confirmPassword}
                            name="confirmPassword"
                            onChange={changeData} />
                    </div>
                    <span className='trouble'>
                        <Link className='trouble' to="/login">Already had a account? Log in!</Link>
                    </span>
                    <br />
                    <span
                        style={{ display: "none" }}
                    >error</span>

                    <button
                        className='button infoButton'
                        onClick={handleSubmit}>Submit</button>

                </form>

            </div>
        </div>
    )
}

export default Register