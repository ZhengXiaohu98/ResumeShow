import { useEffect, useState, useContext} from "react";


import UserProvider from "../../../Context/UserProvider";

const Home = (userDetails) => {

    let user = useContext(UserProvider.context);
    // const user = userDetails.user;

	const logout = () => {
        localStorage.clear();
		window.open(`${process.env.REACT_APP_API_URL}/auth/logout`, "_self");
        user = null;
	};


    return(

        <div>
            <h1>Home page</h1>
            <h2>Profile</h2>
            <p>username: {user.username} </p>
            <p>email: {user.Email} </p>
            <button onClick={logout}>log out</button>
        </div>


    )
}


export default Home;