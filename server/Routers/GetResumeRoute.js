import express from "express";
import * as GetResume from "../Controllers/GetResumeController.js"



const router = express();

// Get all the resumes
router.get("/all", GetResume.getAll);

// Ger partial resumes with filter
router.get("/filtermajor", GetResume.getFilterMajor);



export default router;