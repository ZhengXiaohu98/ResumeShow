import passport from "passport";
import userModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'


//Google login
export const googleCallback = () => {
    try {
        return (passport.authenticate("google", {
            successRedirect: process.env.CLIENT_URL,
            failureRedirect: "/login/failed",
        }));
    } catch (error) {
        console.log("Error in AuthController/googleCallback")
        console.log(error)
    }
}

//Facebook login
export const facebookCallback = () => {
  try {
      return (passport.authenticate("facebook", {
          successRedirect: process.env.CLIENT_URL,
          failureRedirect: "/login/failed",
      }));
  } catch (error) {
      console.log("Error in AuthController/facebookCallback")
      console.log(error)
  }
}

//Github login
export const githubCallback = () => {
    try {
        return (passport.authenticate("github", {
            successRedirect: process.env.CLIENT_URL,
            failureRedirect: "/login/failed",
        }));
    } catch (error) {
        console.log("Error in AuthController/githubCallback")
        console.log(error)
    }
  }





//Regular sign up:
//===========================================
// break register into servel parts:

export const checkAlreadyRegistered = async (req, res, next) => {

    const { Email } = req.body
    const { username } = req.body

    //check if user exist
    try {
        const olderUser = await userModel.findOne({ Email })
        const olderUser2 = await userModel.findOne({ username })
        if (olderUser || olderUser2) {
            return res.status(400).json({ message: "Email or username was used." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    next();
}


export const registerUser = async (req, res, next) => {
    const { username, Email } = req.body
    //encrypt the password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    //save user:
    try {
        await new userModel({
            username, password: hashedPass, Email
        }).save()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }

    next();
};



//===========================================


//Regular Sign in:
export const login = (req, res) => {
    req.login(req.user, function (err) {
        if (err) { res.status(400).json({ error: err }); }
        return res.status(200).json(req.user);
    });
};


// export const loginUser = (req, res, next) => {
//     passport.authenticate("local",
//         (err, user, info) => {
//             if (err) throw err;
//             if (!user) res.status(400).json("No User Exists");
//             else {
//                 req.logIn(user, (err) => {
//                     if (err) throw err;
//                     res.status(200).json({ user })
//                 });
//             }
//         }
//     )(req, res, next);
// }




//login success, return user info
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


export const loginFailed = (req, res) => {
    res.status(401).json({
        error: true,
        message: "Log in failure"
    })
}

export const logout = (req, res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL)
}
