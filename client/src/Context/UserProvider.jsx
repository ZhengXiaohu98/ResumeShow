import React, { createContext, useState, useEffect } from "react";
import jwt_decode from 'jwt-decode'

const context = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    try {
      // decode token then save the user
      const decodedUser = jwt_decode(localStorage.token)._doc
      setUser(decodedUser);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
      <context.Provider value={user}>
          {children}
      </context.Provider>
  );
};

UserProvider.context = context;

export default UserProvider;