import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";

import UserProvider from "./Context/UserProvider";

import './App.css';
import Auth from './component/pages/Auth/Auth';
import Home from "./component/pages/home/home";
import Register from "./component/pages/Register/Register";
import NavBar from "./component/navBar/navBar";
import Post from "./component/pages/Post/Post";



function App() {

  const user = useContext(UserProvider.context);



  return (
    <div className="container">


      <NavBar />

      <Routes>

        <Route
          exact
          path="/"
          element={checkValidUser(user) ? <Home user={user} /> : <Navigate to="/login" />}
        />
        <Route
          exact
          path="/login"
          element={checkValidUser(user) ? <Navigate to="/" /> : <Auth />}
        />
        <Route
          exact
          path="/signup"
          element={checkValidUser(user) ? <Navigate to="/" /> : <Register />}
        />

        <Route
          exact
          path="/post"
          element={checkValidUser(user) ? <Post /> : <Navigate to="/" />}
        />

      </Routes>

    </div>

  );
}

export default App;



const checkValidUser = (user) => {
  try {
    if (user._id) {
      return true
    }
    else {
      return false;
    }
  } catch (error) {
    return false;
  }
}