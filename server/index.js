
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors";
import passport from "passport";
import cookieSession from "cookie-session";

dotenv.config();
import * as passportSetup from "./passport.js";
import * as passportLocalSetup from "./passportLocal.js";
import AuthRoute from "./Routers/AuthRoute.js"

//============================================================================================


// use of middleware
const app = express();

app.use(
	cookieSession({
		name: "session",
		keys: ["ResumeNow"],
		maxAge: 24 * 60 * 60 * 100,
	})
)

//middle-ware that initialises Passport
app.use(passport.initialize());
//middleware to alter the req object and change the 'user' value that 
//is currently the session id (from the client cookie) into the true deserialized user object.
app.use(passport.session());


app.use(bodyParser.json({ extended: true }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
	cors({
		// origin: "http://localhost:3000",
		methods: "GET,POST,PUT,DELETE",
		origin: true,
		credentials: true,
	})
);
//============================================================================================


//connect to mongoDB and listen port
const port = process.env.PORT || 8080;
mongoose
	.connect(
		process.env.MONGO_DB,
		{ useNewUrlParser: true, useUnifiedTopology: true }).then(() => app.listen(port, () => console.log("Listening at " + port)))
	.catch((error) => console.log(error));


//============================================================================================

//usage of routes:
app.use('/auth', AuthRoute)
// app.use('/user', UserRoute)
// app.use('/posts', PostRoute)
// app.use('/upload', UploadRoute)


