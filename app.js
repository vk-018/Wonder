import env from "dotenv";
import dotenv from 'dotenv';
dotenv.config(); 
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

//app.set("views", custom_path) is crucial if EJS files are not in the default views directory.
import path from "path"
import { fileURLToPath } from "url";
//to use put,paste ,delete
import methodOverride from "method-override"
//for styling
import ejsMate from "ejs-mate";

//import custom error class
import ExpressError from "./utilities/ExpressError.js";
//import server side validating schema (using joi)

//importing session from express, to store each session data
import session from "express-session";    //if using this then cookieParser not needed
//importing connect mongo to store express session data in ..... to use it at prodn level
import MongoStore from 'connect-mongo';

//importing flash to show one time messages
import flash from "connect-flash";

//importing passport for defining authentication strategies
import passport from "passport";
//for local startegy  (username , password based login)
import localStrategy from "passport-local";
//allowsus to login through google
import GoogleStrategy from "passport-google-oauth2";   
//importing startegy 
import "./passport/passport-config.js"
  
//using express router
import listing from "./routes/listing.js"
import review from "./routes/review.js"
import userrouter from "./routes/user.js"

import User from "./models/user.js";   //to use in passport
//import dotenv to create env file




//*********************************************************************************************************** */
//*********************************************************************************************************** */
const app= express();
const port=3000;


//to make static style sheets work
app.use(express.static("public"));
// app.use(          not required
//   cors({
//     origin: "https://wonder-gtkx.onrender.com", // frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
//set view engine
// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({extended :true}));           //no need to import body parser

// Set EJS as the view engine
app.set("view engine", "ejs");   //this tells app to look for x.ejs files if x is passed in render argument
//no need ti=o write index.ejs just write index

// Set custom views directory (e.g., ./src/templates/views)
app.set("views", path.join(__dirname, "views"));     //chnages the path where we app looks by default(it still views in this case)

app.use(methodOverride('_method'));

app.engine("ejs", ejsMate);
//atlas db link

const dbURL=process.env.ATLAS_DB;
//setting up mongo store
const store=MongoStore.create({
  mongoUrl: dbURL,
  //store  a secret keyword for our store
  crypto: {     //encrypting the code
    secret: process.env.SESSION_SECRET,   //used to sign the session id cookie
  },
  touchAfter: 24*3600,                     //its the time interval btw the updatation of session data if no chnage has been made, by default its 0, that is even if no change data keep getting updated
});
store.on("error", ()=>{
  console.log("eroro in mongo session store");
})
// ✅ Must be here, before passport/session
app.set('trust proxy', 1);     // force passport oto reirect to http's'   links

//setting up session
var sessionOB ={
    store:store,    //saving mongo store url
    secret: process.env.SESSION_SECRET,   //used to sign the session id cookie
    resave: false,     //to avoid storing data if no change has been made
    saveUninitialized: true,   // saves the data of even unintialized session
    cookie: {
        expires: Date.now()+ 3*24*60*60*1000,
        maxAge: 3*24*60*60*1000,
        httpOnly: true
    }
};

app.use(session(sessionOB));


//using flash
app.use(flash());          //declare  b4 the routes use

//creating miidleware 
app.use((req,res,next)=>{     //app.use menas runs every time
    res.locals.succMessage=req.flash("success");          //now Succmessage will get created as anarray as multiple messages has been passed with same key
    res.locals.failMessage=req.flash("error");         //key name must be error , as it is recognised by passpor
    
    next();
});

//we will be using session to validate the duration of our authenitcation check , untill session is valid , tabs whitching or page changing should not logout the user
//site should identify the user across all different pages
app.use(passport.initialize());     //Adds middleware that prepares Passport to handle authentication.
app.use(passport.session());      //Integrates Passport with Express sessions. that why session must be defined first

passport.use(new localStrategy(User.authenticate()));         //now we are defining a new Local startegy which used User.authenitcate method to authenitcate users
//this User.authenticate() method comes from the local mongoose tool , other wise we should be defining a new strategy

passport.serializeUser((user, cb) => {  
  cb(null, user);
});
//serialize user is used to decide what part of user data will be stored in the session, eg we could have stored just user.email

passport.deserializeUser((user, cb) => { //if we want to acces the user data , it deseriallizes it and passes it to us
  cb(null, user);
  //It retrieves the user info from session and attaches it to req.user , for all req 
  //we coild have accessed the full user detail with just id too
}); 


app.use((req,res,next)=>{
    //console.log(req.user);
    res.locals.currUser= req.user;
    next();
});
    


/**************************************************************************************************************
 * ***********************************************************************************************************/
//connct with data base



main()
 .then(()=> {
    console.log("connected to db");
 })
.catch(err => console.log(err));


async function main() {
  await mongoose.connect(dbURL);                                 //mention the datapase name in last
}


// app.get("/", (req,res)=>{
//     res.send(200);
// });


//loggger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});



/*****************************************************************************************************************/

//using routers

app.use("/listing" ,listing);   //-> any request starting with listing will be passed to router-> listing.js and 
app.use("/listing/:id/review", review);      //bu default this :id parameter never gets passed from app.js  , use mergeParams
app.use("/users",userrouter);

/****************************************************************************************************************** */




//if the user is trying to excess a page with route not defined yet  (in our domain), this route will handle that case
app.get("/{*splat}", (req,res,next)=>{                  // *splat matches any path without the root path. If you need to match the root path as well /, you can use /{*splat}, wrapping the wildcard in braces.
    //not found is just a name u can use any name
    const err=new ExpressError(404, "Page not Found");
    next(err);
});

//middleware for handling erors 
app.use((err,req,res,next)=>{
    //we get our custom error or default error class here
    let {status=500,message="Something went wrong"}= err;
    res.status(status).render("error.ejs",{err});
    //res.status(status).send(message);    
    //not using next hence the chain breaks and now the default express handler wont be called
})

app.listen(port , ()=>{
    console.log(`listening at port number: ${port}`);
})
