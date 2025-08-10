import express from "express";
import wrapAsync from "../utilities/wrapAsync.js";
import User from "../models/user.js";
import passport from "passport";
import {isLoggedIn} from "../middleware.js";
import { saveRedirect } from "../middleware.js";
import { signinget,signupget,signoutget, succGoogle, signuppost, signinpost } from "../controller/user.js";
const router= express.Router();



router
.route("/signup")
.get(wrapAsync(signupget))
.post(wrapAsync(signuppost));



//If authentication is successful, the user will be logged in and populated at req.user and a session will be established
//  by default. If authentication fails, an unauthorized response will be sent.
router
.route("/signin")
.get(wrapAsync(signinget))
.post(
  //calling middleware to save the req.original url
  saveRedirect,
  
//passport.authenitcate() is used a middleware
  passport.authenticate(
        'local',  //startegy name
        {failureRedirect : "/users/signin",   //in cerror
        failureFlash: true,    //error message if filure authentication failed
  }),         
  wrapAsync(signinpost));



router.get("/signout",
     isLoggedIn,
     wrapAsync(signoutget)
    );

//defining the goole login routes
// Trigger Google login
//This tells Passport to redirect the user to Google's login/consent screen. -- it initates the google oAuth process
//this route is just covention we can customize it
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// this should match the corresponding url uploaded in google cloud
//If the user agrees Oauth req, Google redirects to the redirect URL you registered (both in the code and on the Google Developer Console)
router.get('/auth/google/listing',         //this route is automatically triggerd bcoz this redirect url is given in Oauth clien id
  passport.authenticate('google', 
  { failureRedirect: '/users/signin',
    failureFlash: true 
  }),
  succGoogle
);

// // Logout route  logout route handled by local strategy signout route
// router.get('/logout', (req, res) => {
//   req.logout(() => {
//     req.flash("success" ,"Successfully Logged Out")
//     res.redirect('/listing');
//   });
// });




export default router;
