//Express.Router() is a built-in feature in Express that lets you create modular, mountable route handlers.
//this will help us in storing out one kind of restful apis at one place  -> makes the code cleaner


import express from "express";
import List from "../models/listing.js";

//import wrapAync  -> to avoid try catch block
import wrapAsync from "../utilities/wrapAsync.js";

//import custom error class
import ExpressError from "../utilities/ExpressError.js";
//import server side validating schema (using joi)
import { listingschema } from "../schema.js";

//import looggid in to check authentication
import {isLoggedIn,isOwner,validateListing} from "../middleware.js";

//import callbacks from controllers
import {index, newList,filterCountry,filterList,listShow, editForm, addList, editList, deleteListing} from "../controller/listing.js";

//to access the files coming thorugh multipart forms (file uploads)
import multer from 'multer';
//import storage to use caludinary
import { storage } from "../cloudConfig.js";

const upload = multer({storage});     //this is where the the uoloaded files will get stored use{dest: <folder_name> for local storage}



/************************************************************************************************************************ */

//creating router
const router= express.Router();

/****************************************************************************************************************** */

//USED FNS
//middleware to catch multer erros


const uploadImage = (req, res, next) => {   
  upload.single("image")(req, res, function (err) {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message || "Multer error" });
    }
    next();
  });
};




/****************************************************************************************************************** */
//declaring routes  -> all the routes should be defined w.r.t /listing


//this route will how the titles of all the places 
router.get("/" ,wrapAsync(index));

//to add a place
router.get("/new" ,isLoggedIn, newList);

//get route to show filtered listings
router.get("/country/:countryName",wrapAsync(filterCountry));
router.get("/filter/:category",wrapAsync(filterList));

//get route to show individual elements
//as id keeps changing this is a dynamic route   -> all dynamic routes must be defined after static routes

router.get("/:id" ,wrapAsync(listShow));

//load the edit page
router
.route("/edit/:id")
.get(isLoggedIn,wrapAsync(editForm))
.put(
    isLoggedIn,
    isOwner,
    uploadImage,
    validateListing,
    wrapAsync(editList)
);



/**************************************************************************************************************** */

//now post request to add new place

router.post("/add",
    isLoggedIn,
    uploadImage,   //processing the file at this field using multer,  just using try catch for upload.single
    //to catch errors caused by multers
    validateListing,
    wrapAsync(addList),
    
);

//delete route
router.delete("/delete/:id" ,isLoggedIn,
    isOwner,
    wrapAsync(deleteListing));

export default router