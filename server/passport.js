import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github";

import passport from "passport";
import userModel from './Models/userModel.js'
import dotenv from 'dotenv';
dotenv.config();

/***************************************
*       Using Google Strategy          *
***************************************/
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


/***************************************
*       Using Github Strategy          *
***************************************/
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.CLIENT_ID_GitHub,
      clientSecret: process.env.CLIENT_SECRET_GitHub,
      callbackURL: "/auth/github/callback",
      scope: ["read:user", "user:email"],
    },
    function(accessToken, refreshToken, profile, done) {

      userModel.findOne({
        providerUserId: profile.id
      }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          let email = profile.email
          if(profile.email == null){
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

/***************************************
*       Using JWToken                  *
***************************************/
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = "secret"

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.findById(jwt_payload._id)
    .then(user => {
      if(user) {
        return done(null, user)
      }
      return done(null, false)
    })  
    .catch(err => console.log(err))
}))