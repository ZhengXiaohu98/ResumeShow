import { React } from "react";
import "./home.css";

import ResumeBox from "./resumebox";
import { Divider } from 'antd';

const Home = () => {

//==================================================================================
  return (
    <div>
      <Divider orientation="left">Sort/Filter resumes</Divider>
      <ResumeBox />
    </div>
  )
}

export default Home;