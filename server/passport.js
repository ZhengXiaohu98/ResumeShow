import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github";

import passport from "passport";
import userModel from './Models/userModel.js'
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },

    //define callback function
    function (accessToken, refreshToken, profile, done) {
      userModel.findOne({
        providerUserId: profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }

        //No user was found... so create a new user with values from google profile
        if (!user) {
          //build username
          const mailAddr = profile.emails[0].value
          const index = mailAddr.indexOf("@")
          const newName = mailAddr.substring(0, index);

          user = new userModel({
            username: newName,
            Email: profile.emails[0].value,
            password: "unknown",
            name: profile.displayName,
            provider: 'google',
            providerUserId: profile.id,
            providerProfile: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        }

        //found user. Return
        else {
          return done(err, user);
        }
      });
    }
  )
)




passport.use(
  new GithubStrategy(
    {
      clientID: process.env.CLIENT_ID_GITHUB,
      clientSecret: process.env.CLIENT_SECRET_GITHUB,
      callbackURL: "/auth/github/callback",
      scope: ["read:user", "user:email"],
    },
    function (accessToken, refreshToken, profile, done) {

      userModel.findOne({
        providerUserId: profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          let email = profile.email
          if (profile.email == null) {
            email = "null@github.com"
          }
          user = new userModel({
            username: profile.username,
            Email: email,
            password: "unknown",
            name: profile.name,
            provider: 'github',
            providerUserId: profile.id,
            providerProfile: profile._json
          });
          user.save(function (err) {
            if (err) console.log(err);
            return done(err, user);
          });
        }
        //found user. Return
        else {
          return done(err, user);
        }
      });

    }
  )
)




//due to using cookie session, need to serialize user
passport.serializeUser((user, done) => {
  return done(null, user)
})

passport.deserializeUser((user, done) => {
  return done(null, user)
})




//This will find the correct user from the database and pass it as a closure variable into the callback done(err,user);
//so the above code in the passport.session() can replace the 'user' value in the req object and pass on to the next middleware in the pile.
// passport.deserializeUser(function (user, done) {
//     //If using Mongoose with MongoDB; if other you will need JS specific to that schema.
//     userModel.findById(user.id, function (err, user) {
//         done(err, user);
//     });
// });