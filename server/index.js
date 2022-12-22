
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors";
import passport from "passport";
import session from 'express-session';
import cookieParser from "cookie-parser"
import MongoStore from 'connect-mongo'

dotenv.config();
import * as passportSetup from "./passport.js";
import * as passportLocalSetup from "./passportLocal.js";

// routes
import AuthRoute from "./Routers/AuthRoute.js"
import PostRoute from "./Routers/PostRoute.js"
import GetResumeRoute from "./Routers/GetResumeRoute.js"
import CommentRoute from "./Routers/CommentRoute.js"
//============================================================================================

// use of middleware
const app = express();

app.use(cookieParser());
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.set("trust proxy", 1);

app.use(
	cors({
		origin: process.env.CLIENT_URL,
		methods: "GET, PUT, POST, DELETE",
		origin: true,
		credentials: true,
	})
);

app.use(session({
	secret: 'resumeShow',
	resave: false, //don't save session if unmodified
	saveUninitialized: true, // don't create session until something stored

	store: MongoStore.create({
		mongoUrl: process.env.MONGO_DB,
		dbName: 'test-app',
		autoRemove: 'interval',
		autoRemoveInterval: 100 // In minutes. Default
	}),
	cookie: {
		httpOnly: true, sameSite: 'none', secure: true,
	}

}));

//middle-ware that initialises Passport
app.use(passport.initialize())
app.use(passport.session());

app.use(bodyParser.json({limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }))

app.use(
	cors({
		methods: "*",
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
app.use('/getresume', GetResumeRoute)
app.use('/posts', PostRoute)
app.use('/comments', CommentRoute)

app.use('/test', (req, res) => {
  return res.json("test")
})


