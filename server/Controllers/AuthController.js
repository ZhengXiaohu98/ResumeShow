import passport from "passport";
import userModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'


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

  req.login(req.user, function (err) {
    if (err) {
      res.status(400).json({ error: err });
    }
  });
  req.session.user = req.user;
  req.session.save();
  res.status(200).json(req.user);
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


/***************
*  LOGIN SUCCESS  *
*** ************/
export const loginSuccess = (req, res) => {

  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Login success",
      user: req.user
    })
  }
  else {
    res.status(403).json({
      error: true,
      message: "Not Authorized"
    })
  }
}

/***************
*  LOG OUT  *
*** ************/
export const logout = (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
  });
  req.session.destroy();
  res.redirect(process.env.CLIENT_URL)
}
