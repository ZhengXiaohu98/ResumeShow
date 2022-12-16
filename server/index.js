import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors";
import passport from "passport";

dotenv.config();

// routes
import AuthRoute from "./Routers/AuthRoute.js"
import PostRoute from "./Routers/PostRoute.js"
import GetResumeRoute from "./Routers/GetResumeRoute.js"
import CommentRoute from "./Routers/CommentRoute.js"
//============================================================================================

// use of middleware
const app = express();

//middle-ware that initialises Passport
app.use(passport.initialize())

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


