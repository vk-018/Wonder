import User from "../models/user.js";

let signupget=async(req,res)=>{
    res.render("user/signup.ejs");
};

let signinget =async(req,res)=>{
    res.render("user/signin.ejs");
};

let signoutget=async(req,res,next)=>{
     req.logout((err)=> {     //it always expects a callback
           if(err){
            return next(err);
           }
           req.flash("success", "Logged out Successfully");
           res.redirect("/listing");
        }
    )};


//successfull google login
let succGoogle=(req, res) => {
    // Successful login
    req.flash("success", `Welcome to Wander ${req.user.username}`);
    console.log(req.originalUrl);
    res.redirect('/listing');
  } ; 


let signuppost=async (req,res,next)=>{        //wehen we are using wrapAsync when we encounter an error we get to noewhere page wehere recieve the eroro message
    
    //using try catch block to remain un the sign up page , and flshing the error as well
    //console.log(req.body);
    try{
    var email=req.body.email;
    var username= req.body.username;
    var password=req.body.password;
    //we can directly deconstruct

    let user1= new User({
        email : email,
        username: username
    });

    let newUser= await User.register(user1,password);       //in build mongo local fn , return the registred user , password in stored after salting and hashing
    console.log(newUser);
    
    //loggin after sucessful sign up
    req.login(newUser ,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", `Welcome to Wander ${newUser.username}`);
        res.redirect("/listing");
    })
    
    }
    catch(err){
         console.log(err);
        req.flash("error","User already exists with this Email or Username");
        res.redirect("/users/signup")
    }

};

//passport.authenitcate() is used a middleware

//If authentication is successful, the user will be logged in and populated at req.user and a session will be established
//  by default. If authentication fails, an unauthorized response will be sent.
let signinpost =async (req,res)=>{           //this gets excuted only when authenitcation successfull
         req.flash("success",`Welcome to Wander ${req.body.username}` )
         console.log(req.originalUrl);
         if(res.locals.redirectUrl){
            res.redirect(res.locals.redirectUrl);  
         }
         else{
          res.redirect("/listing");
         } 
};

export {signinget,signupget,signoutget,succGoogle,signuppost,signinpost};
