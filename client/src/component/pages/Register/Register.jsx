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

        const response = await AuthAPI.signUp(formData)
        window.open("http://localhost:3000", "_self");

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


    return (
        <div className="auth">

            <div className="authContainer">
                <img id='backGround' src={background} alt="" />



                <form className="infoForm authform">
                    <span className='authTitle'>User Signup</span>
                    <br />
                    <span className='authDesc'>Enter your infomation to create your own account!</span>
                    <br />
                    <div className='infoInputWraper'>
                        <input
                            className="infoInput"
                            required
                            type="text"
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