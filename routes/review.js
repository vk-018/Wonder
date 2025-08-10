import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import Review from "../models/review.js";
import List from "../models/listing.js";
import ExpressError from "../utilities/ExpressError.js";
import { reviewschema } from "../schema.js";
//to authenticate
import {isLoggedIn} from "../middleware.js";
import { validatereview } from "../middleware.js";
import { addReview, delReview } from "../controller/review.js";


/********************************************************************************************************************** */

//creating router
const router = express.Router({mergeParams:true});           // must to deduce dynamic id from app.js

/************************************************************************************************************** */
/******************************************************************************************************************* */

//routes for review    -> all routes defined with respect "/listing/:id/review"
router.post("", isLoggedIn,validatereview,wrapAsync(addReview));


//deleting a listing
router.delete("/:reviewid",isLoggedIn, wrapAsync(delReview))

export default router