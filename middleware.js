import List from "./models/listing.js";
import { listingschema } from "./schema.js";
import { reviewschema } from "./schema.js";
import ExpressError from "./utilities/ExpressError.js";

async function isLoggedIn(req,res,next){
    //checks for authenitcation
    if(!req.isAuthenticated()){
        //save the redirect url
        console.log(req.originalUrl);
        if(req.method==="GET"){
        req.session.redirectUrl= req.originalUrl;
        }
        req.flash("error" , "You must be Logged in First!");
        return res.redirect("/users/signin");
    }
    next();
}

async function saveRedirect(req,res,next){
    //console.log(req.session.redirectUrl)
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
        //console.log("yes");
    }
    next()
}


async function isOwner(req,res,next){
    //is logged in is already getting checked so req.user must exist
    console.log(req.user);
    let id= req.params.id;
    let listing= await List.findById(id);
    console.log(listing.owner._id);
    if(!(listing.owner.equals(req.user._id))){
        req.flash("error","Only the Owner Can Edit/Delete Listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

function validateListing(req,res,next){
    if (!req.body || typeof req.body !== 'object') {
        throw new ExpressError(400,"Listing data is missing or invalid");   //listing data not passed
    }

    let {error}=listingschema.validate(req.body); //checking if this object satisfies our schema and storing error
    //if there is an error it will exist as an key to result object
    console.log(error);
    if(error){    //if error exists

        //this error have an object deatil which we can extract if we want
        let errMsg=error.details.map((el)=> el.message).join(",");
        console.log(errMsg);       //it gives the same err message

        throw new ExpressError(400,error);
    } else{
        next();
    }  
}

//for server side validation
function validatereview(req,res,next){
    if (!req.body || typeof req.body !== 'object') {
        throw new ExpressError(400,"Review is missing or invalid");   //no revire given data not passed
    }

    let {error}=reviewschema.validate(req.body); //checking if this object satisfies our schema and storing error
    //if there is an error it will exist as an key to result object
    if(error){    //if error exists
        throw new ExpressError(400,error);
    } else{
        next();
    }  
}

export {isLoggedIn, saveRedirect,isOwner,validateListing,validatereview} 