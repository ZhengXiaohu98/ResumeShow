import userModel from "./Models/userModel.js";
import passport from "passport";
import bcrypt from "bcrypt"
import { Strategy as localStrategy } from "passport-local";


// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
    console.log('*** serializeUser called, user: ');
    console.log(user); // the whole raw user object!
    console.log('---------');
    done(null, { _id: user._id });
});


// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
    console.log('DeserializeUser called');
    userModel.findOne({ _id: id }, 'username', (err, user) => {
        console.log('*** Deserialize user, user:')
        console.log(user)
        console.log('--------------')
        done(null, user)
    });
});


const strategy = new localStrategy(
    { usernameField: 'username' },
    function (username, password, done) {

        userModel.findOne({ username: username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Invalid username' });
            }

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) console.log(err) //throw err;
                if (result === true) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            });
        });
    }
);

passport.use(strategy);










// passport.use(
//     new localStrategy((username, password, done) => {

//         userModel.findOne({ username: username }, (err, user) => {
//             if (err) throw err;
//             if (!user) return done(null, false);
//             bcrypt.compare(password, user.password, (err, result) => {
//                 if (err) throw err;
//                 if (result === true) {
//                     return done(null, user);
//                 } else {
//                     return done(null, false);
//                 }
//             });
//         });
//     })
// );

//if we want to use email as the login accounta
// passport.use(
//     new localStrategy({
//         usernameField: 'Email',
//         passwordField: 'password'
//     },
//         (Email, password, done) => {
//             userModel.findOne({ Email: Email }, (err, user) => {
//                 if (err) throw err;
//                 if (!user) return done(null, false);
//                 bcrypt.compare(password, user.password, (err, result) => {
//                     if (err) throw err;
//                     if (result === true) {
//                         return done(null, user);
//                     } else {
//                         return done(null, false);
//                     }
//                 });
//             });
//         })
// );