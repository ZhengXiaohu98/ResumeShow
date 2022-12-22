import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import "./navBar.css"

import UserProvider from "../../Context/UserProvider";

const NavBar = () => {

  const user = useContext(UserProvider.context);
  const [click, setClick] = useState(false);

  // logout the user
  const logout = () => {
    localStorage.clear();
    window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
  };

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

//========================================================================================
  return (
    <>
      <nav className="navbar">
        <span className="navbar-logo">
          <Link className="nav-links" to="/" onClick={closeMobileMenu}>
            ResumeShow
          </Link>
        </span>

        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? "fas fa-times" : "fas fa-bars"} />
        </div>

        {/* Check if it is a valid user, if not, navigate to login page */}
        {checkValidUser(user) ? (
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-links menu-links">Hi, {user.username}</li>

            <Link
              to="/"
              className="nav-links menu-links"
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            <Link
              to="/post"
              className="nav-links menu-links"
              onClick={closeMobileMenu}
            >
              Post
            </Link>

            <Link className="nav-links menu-links" onClick={logout} to="/login">
              LogOut
            </Link>
          </ul>
        ) : (
          <ul className={click ? "nav-menu active" : "nav-menu"}>

            <Link className="nav-links menu-links" to="/login" onClick={closeMobileMenu}>
              Login
            </Link>

            <Link className="nav-links menu-links" to="/signup" onClick={closeMobileMenu}>
              Signup
            </Link>
          </ul>
        )}
      </nav>
    </>
  );
};

export default NavBar;

const checkValidUser = (user) => {
  try {
    if (user.Email) {
      return true
    }
    else {
      return false;
    }
  } catch (error) {
    return false;
  }
}