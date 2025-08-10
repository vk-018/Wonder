import Review from "../models/review.js"
import List from "../models/listing.js";

let addReview=async(req,res)=>{
   
    var id=req.params.id;
    
    req.body.owner= req.user._id;
    let newReview=new Review(req.body);
    
    let listing= await List.findById(id);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Added Succesfuuly");
    res.redirect(`/listing/${id}`)    
}

let delReview=async(req,res)=>{

    let {id , reviewid}= req.params;       
    const review= await Review.findById(reviewid).populate("owner");
    if(req.user.username===review.owner.username){
    const listing=await List.updateOne(
        {_id: id},
        {$pull : {reviews : reviewid}}
    );
    
       const data1=await Review.findByIdAndDelete(reviewid);
       req.flash("success", "Review Deleted Succesfully");
    res.redirect(`/listing/${id}`);
    }
    else{
        req.flash("error", "Only the owner can delete Review");
        res.redirect(`/listing/${id}`);
    }
}

export {addReview,delReview}