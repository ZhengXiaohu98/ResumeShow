import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const context = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;

      const { data } = await axios.get(url, { withCredentials: true });
      console.log(data)
      setUser(data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();

  }, []);

  return (
    <context.Provider value={user}>
      {children}
    </context.Provider>
  );
};

UserProvider.context = context;

export default UserProvider;