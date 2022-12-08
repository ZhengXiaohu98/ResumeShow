import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { createBrowserHistory } from "history";


import UserProvider from "./Context/UserProvider";

import './App.css';
import Auth from './component/pages/Auth/Auth';
import Home from "./component/pages/home/home";
import Register from "./component/pages/Register/Register";
import NavBar from "./component/navBar/navBar";
import PostContainer from "./component/pages/Post/PostContainer";
import PostDetail from "./component/pages/PostDetail/PostDetail";



function App() {

  const user = useContext(UserProvider.context);

  // const [loggedIn, setLoggedIn] = useState(null);
  // useEffect(() => {
  //   const loggedUser = localStorage.getItem('user');
  //   setLoggedIn(Boolean(loggedUser));
  // }, []);

  return (
    <div className="container">


      <NavBar />

      <Routes history={createBrowserHistory}>

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
          element={checkValidUser(user) ? <PostContainer /> : <Navigate to="/" />}
        />

        <Route
          exact
          path="/postdetail/:id"
          element={checkValidUser(user) ? <PostDetail /> : <Navigate to="/" />}
        />
        <Route
          exact
          path="post/postdetail/:id"
          element={checkValidUser(user) ? <PostDetail /> : <Navigate to="/" />}
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