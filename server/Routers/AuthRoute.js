import express from "express";
import passport from "passport";
import * as AuthController from "../Controllers/AuthController.js"
import * as passportSetup from "../passport.js";
import * as passportLocalSetup from "../passportLocal.js";


const router = express();

//google login
router.get("/google/callback", AuthController.googleCallback());
router.get("/google", passport.authenticate("google", ["profile", "email"]));

//github login
router.get("/github/callback", AuthController.githubCallback());
router.get("/github", passport.authenticate("github", ["read:user", "user:email"]));

//regular sign up and login:
router.post('/register', AuthController.checkAlreadyRegistered, AuthController.registerUser, passport.authenticate("local"), AuthController.login)

router.post('/login', passport.authenticate("local"), AuthController.login)



router.get("/login/failed", AuthController.loginFailed)
router.get("/login/success", AuthController.loginSuccess)
router.get("/logout", AuthController.logout)

export default router;

