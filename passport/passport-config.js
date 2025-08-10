import passport from "passport";
//to use env files
import dotenv from 'dotenv';
dotenv.config();
import env from "dotenv";

import passportLocalMongoose from "passport-local-mongoose";
//import startegy to use it to define one
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

console.log(process.env.GOOGLE_CLIENT_ID);


//this wiill be used to define passport startegies to authenticate

//defining a google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async(accessToken, refreshToken, profile, done) => {
    //this is a vrufy fn 
    /*

accessToken	Token you can use to access Google APIs on behalf of the user (e.g. Google Calendar, Gmail).
refreshToken	Token used to get a new access token after it expires. Usually only sent on first login.
profile	Contains the user's Google profile information (name, email, id, etc.).
done	A callback you call when you're done finding or creating the user.
    */
    // TODO: Save or find user in DB here
    //console.log(profile);
    try{
        let user= await User.findOne({username : profile.displayName});
        if(!user){
          let email= profile.emails[0].value;
          let username= profile.displayName;
          
          
          let user1= new User({
                  email : email,
                  username: username,
                  //password: "Google"
          });
        user= await user1.save();
        console.log("added:" +user);
        }
        //Passport expects you to pass the user object from your DB to done(), not the raw Google profile.
        return done(null,user);     //will be used to populate req.user
    }
    catch(err){
        done(err);
    }
    
  }
));
