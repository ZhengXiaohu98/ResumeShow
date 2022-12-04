import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
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
    //callback(null, profile); //return profile details
  )
)

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FB_CLIENT_ID,
//       clientSecret: process.env.FB_CLIENT_SECRET,
//       callbackURL: "/auth/facebook/callback",
//       scope: ["profile", "email"],
//     },
//     function(accessToken, refreshToken, profile, done) {
//       userModel.findOne({
//         providerUserId: profile.id
//       }, function (err, user) {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           //build username
//           const mailAddr = profile.emails[0].value
//           const index = mailAddr.indexOf("@")
//           const newName = mailAddr.substring(0, index);

//           user = new userModel({
//             username: newName,
//             Email: profile.emails[0].value,
//             password: "unknown",  
//             name: profile.displayName,
//             provider: 'facebook',
//             providerUserId: profile.id,
//             providerProfile: profile._json
//           });
//           user.save(function (err) {
//             if (err) console.log(err);
//             return done(err, user);
//           });
//         }
//         //found user. Return
//         else {
//           return done(err, user);
//         }
//       });
//     }
//   )
// )


//due to using cookie session, need to serialize user
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})




//This will find the correct user from the database and pass it as a closure variable into the callback done(err,user);
//so the above code in the passport.session() can replace the 'user' value in the req object and pass on to the next middleware in the pile.
// passport.deserializeUser(function (user, done) {
//     //If using Mongoose with MongoDB; if other you will need JS specific to that schema.
//     User.findById(user.id, function (err, user) {
//         done(err, user);
//     });
// });