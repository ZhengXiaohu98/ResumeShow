import { useEffect, useState, useContext, React } from "react";
import "./home.css";

import ResumeBox from "./resumebox";
import { Divider } from 'antd';


import UserProvider from "../../../Context/UserProvider";

const Home = (userDetails) => {

  let user = useContext(UserProvider.context);
  // const user = userDetails.user;

  const logout = () => {
    localStorage.clear();
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
    user = null;
  };

  
  return (

    <div>
      <Divider orientation="left">Sort/Filter resumes</Divider>
      <ResumeBox />
    </div>
  )
}


export default Home;