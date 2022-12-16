import express from "express";
import passport from "passport";
import * as AuthController from "../Controllers/AuthController.js"

const router = express();

//google login
router.get("/google/callback", AuthController.googleCallback());
router.get("/google", passport.authenticate("google", ["profile", "email"]));

//github login
router.get("/github/callback", AuthController.githubCallback());
router.get("/github", passport.authenticate("github", ["read:user", "user:email"]));

//regular sign up and login:
router.post('/register', AuthController.checkAlreadyRegistered, AuthController.registerUser, AuthController.login)

router.post('/login', AuthController.login)



router.get("/login/failed", AuthController.loginFailed)

export default router;

