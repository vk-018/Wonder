import mongoose from "mongoose";
import Review from "./review.js";
import User from "./user.js";
import wrapAsync from "../utilities/wrapAsync.js";

//connecting to db not needed , just create the model then export

//ceating schema
const listSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true,
        
    },
    location: {
        type: String,
        required: true
    },
    country:{
        type: String,
        required:true
    },
    //stoing coordinates in geojson format
    geometry: {
    type: {
      type: String, // Don't do `{ geometry: { type: String } }`
      enum: ['point'], // 'location.type' must be 'Point'
      
    },
    coordinates: {
      type: [Number],  //long first
      
    },

  },
  //adding category to model to make our filter option work
    category: {
        type: String,
        enum: ["Mountain","Beach","Apartment","Farm","Iconic","Trending"],
        required: true,
    },

    //declaring reviews arrays to establish one to many relationship
    reviews : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
       
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

//post middleware for this schema
                //name of the fn which triggers this middleware
listSchema.post("findOneAndDelete",async(data)=>{    //data is the object which got deleted      -> dont use Wrapasync You are correct: using wrapAsync (or similar error-handling wrappers) is not compatible with Mongoose middleware, especially with post middleware
    console.log("middleware triggered");
    if(data.reviews.length){      //if it containes any reviews
        let result=await Review.deleteMany({_id: {$in: data.reviews}});
        console.log(result);
    }
});


//creating model   (collection /table)
//name it singular and first letter capital
const List = mongoose.model("List", listSchema);

//So, use module.exports to make functions, variables, or classes from one file usable in another. It’s the foundation of modular development in Node.js.

export default List;
