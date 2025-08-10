import { get } from "mongoose";
import List from "../models/listing.js";
import { listingschema } from "../schema.js";
import getCoordinates from "../utilities/geoCoding.js";


let index= async(req,res)=>{
    
    //you can either use promises or try catch block  -> using wrapAsync does everything
        const data = await List.find({});
        //console.log(data);
        res.render("listing/index.ejs",{data});         //pass ejs file wrt views folder
};
let filterCountry= async(req,res)=>{
        //req,body gets populated only in case of post/patch/put/delete req
        //for get its req.query
        console.log(req.query);
        let country= req.query.search.toLowerCase();
        const data = await List.find({country:country});
        //console.log(data);
        res.render("listing/filterCountry.ejs",{data});         //pass ejs file wrt views folder
};
let filterList= async(req,res)=>{
        console.log(req.params)
        let category= req.params.category;
        const data = await List.find({category:category});
        //console.log(data);
        res.render("listing/filter.ejs",{data});         //pass ejs file wrt views folder
};


let newList = async(req,res)=> {
    console.log("hit");
    res.render("listing/new.ejs");
};


let listShow=async(req,res)=>{
    let id=req.params.id;
    //console.log(id);
    //Each path corresponds to a field in your schema that contains a reference (ref) to another model
        const data= await List.find({_id:id}).populate([{   //nested populate
            path: "reviews",
            populate : {path : "owner"}
        },{
            path:"owner"
        }]);
        
        if(!data[0]){
            req.flash("error", "Listing does not Exist");
            res.redirect("/listing");
        }
        else{
        //console.log(data[0]);
        res.render("listing/show.ejs",{data});         //pass ejs file wrt views folder
        } 
}

let editForm= async(req,res)=>{
    let id=req.params.id;
    //console.log(id);
        const listing = await List.findById(id).populate("owner");
        if(req.user.username===listing.owner.username){
        const data = await List.find({_id:id});
        console.log(data);
        //create an link for the preview image.....from cloudinary docs we know how to edit the image
        let imageurl=data[0].image.url;
        imageurl= imageurl.replace("/upload","/upload/w_250,h_200")
        //console.log(data);
        res.render("listing/edit.ejs",{data,imageurl});         //pass ejs file wrt views folder
        }
        else{
            req.flash("error", "Only the Owner can Edit listing");
            res.redirect(`/listing/${id}`);
        }  
}


let addList= async(req,res,next)=>{     

    //console.log(req.body);
    //if this route is getting triggered after submitting new.ejs then req.body must be correct because of form validations
    //but if req is sent through postman type application we need more checks

    /* long method - hardcoded
    if(req.body===undefined){         //nothing passed in body
        throw new ExpressError(400, "Send valid Data");          //400 menas bad req, error from client side
    }

    //cheking if one of the inputs is missing
    const requiredFields = ["title", "description", "price", "location", "country"];

    for(var i=0;i<requiredFields.length;i++) {
        
      if (!req.body[requiredFields[i]]) {    //use dot operator only when the key is an actual key for a varibale use []
       throw new ExpressError(400, `${requiredFields[i][0].toUpperCase() + requiredFields[i].slice(1)} must be filled`);
      }                                                    //adding rest part (apart from first leter)
    }
      */

    //shorter methhod to validate server side data input to avoid bad req through clients like postman -> wil be to use the abv middleware through joy
    
    //console.log(req.user);


    //we must extract the url and filename of image uploaded
    let url= req.file.path;
    let filename=req.file.filename;
    //add these value to image field
    req.body.image={url,filename};

    //add owner name as it is not in the form
    req.body.owner=req.user._id;

    //console.log(req.body);
    //we will do geo coding here
    console.log(req.body.location);
    let coordinates=await getCoordinates(req.body.location+","+req.body.country);
    console.log(coordinates);
    let geometry={type:"point", coordinates: [coordinates.lon,coordinates.lat]};
     
    req.body.geometry=geometry;
    req.body.country=req.body.country.toLowerCase();
    console.log(req.body);
    let newList= new List(req.body);  
    await newList.save()
    // before redirecting add a message that added sucessfully
    req.flash("success", "New Listing Added Successfully");    //middlweare will be used to put it into res.locals
    res.redirect("/listing");  
}

let editList=async(req,res)=>{ 
    let id=req.params.id;
   
        //we want to update only those fiesld which are coming through the form not others 
        //we sue set operator to do that
       
        //someone who is not the owner may send a edit put req through potsman like appss , so cheking ownership here also is must....lets use middle ware for that
        if(req.file){  //may use type of req.file!==undefined
           let url= req.file.path;
           let filename=req.file.filename;
           //add these value to image field
           req.body.image={url,filename};
        }
       console.log(req.body.location);
       let coordinates=await getCoordinates(req.body.location+","+req.body.country);
       console.log(coordinates);
       let geometry={type:"point", coordinates: [coordinates.lon,coordinates.lat]};
       req.body.geometry=geometry;
       req.body.country=req.body.country.toLowerCase();
        const data=await List.findByIdAndUpdate(
                              id,
                              { $set: req.body},
                              {
                                new: true,      //return updated values
                                 runValidators: true, // ✅ applies schema validation
                               }
                        );
        // before redirecting add a message that added sucessfully
        req.flash("success", "Listing Edited Successfully");
        res.redirect(`/listing/${id}`);                  //pass ejs file wrt views folder    
}


let deleteListing=async(req,res)=>{
    let id=req.params.id;
       const data = await List.findByIdAndDelete(id);
       req.flash("success","Listing Deleted Successfully");
       res.redirect("/listing");  
       
}
export {index,newList,filterCountry,filterList,listShow,editForm,addList,editList,deleteListing};
