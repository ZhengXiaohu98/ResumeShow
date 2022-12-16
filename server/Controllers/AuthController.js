import passport from "passport";
import userModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


/***************************************
*             Google Login             *
***************************************/
export const googleCallback = () => {
  try {
    return (passport.authenticate("google", {
      successRedirect: process.env.CLIENT_URL,
      failureRedirect: "/login/failed",
    }));
  } catch (err) {
    console.log("Error in AuthController/googleCallback")
  }
}

/***************************************
*             Github Login             *
***************************************/
export const githubCallback = () => {
  try {
    return (passport.authenticate("github", {
      successRedirect: process.env.CLIENT_URL,
      failureRedirect: "/login/failed",
    }));
  } catch (error) {
    console.log(error)
  }
}


//================== Sign Up on our site =========================

/**************************************************
* function to check if user is already registered *
***************************************************/
export const checkAlreadyRegistered = async (req, res, next) => {

  const { Email, username } = req.body

  // logic to find user by username and eamil
  // if found any, return 400
  try {
    const userFoundByEmail = await userModel.findOne({ Email })
    const userFoundByUsername = await userModel.findOne({ username })
    if (userFoundByEmail || userFoundByUsername) {
      return res.status(400).json({ message: "Email or username was used." })
    }
  } catch (err) {
    res.status(500).json({ message: error.message })
  }

  next();
}

/***************************************
* function to register a regular user  *
****************************************/
export const registerUser = async (req, res, next) => {
  const { username, Email } = req.body
  // encrypt the password
  const salt = await bcrypt.genSalt(10)
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  // creat a new user
  try {
    await new userModel({
      username, password: hashedPass, Email
    }).save()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

  next();
};

/******************
* REGULAR LOGIN   *
*** ****************/
export const login = (req, res) => {

  const { username, password } = req.body;

  userModel.findOne({ username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ username: "Username does not exist!" })
      }

      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            jwt.sign({...user }, "secret", { expiresIn: "3d" }, (err, token) => {
              res.status(200).json({
                success: true,
                token: "Bearer " + token
              })
            })
          } else {
            return res.status(400).json({ password: "Wrong password" })
          }
        })
    })
}

/***************
*  LOGIN FAIL  *
*** ************/
export const loginFailed = (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure"
  })
}
