import mongoose from "mongoose";
import List from "../models/listing.js";
import sampleListings from "./data.js";
import dotenv from 'dotenv';
dotenv.config(); 
//all the data variables get imported as immutable objects

//this file will be used to intiallise the db
console.log(process.env.ATLAS_DB);
const dbURL=process.env.ATLAS_DB;
main()
 .then(()=> {
    console.log("connected to db");
 })
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);                                       //mention the datapase name in last
}

async function initDB(){
    //first we clean our db
    let deleted= await List.deleteMany({});
    //update the data with a owner list
    //map creates a new array
    const updatedSampleListings = sampleListings.map((element)=> ({ ...element, owner: '68860208b2fe435e59ca4333'}));
    //adding the category field
    const categories = ["Mountain", "Beach", "Apartment", "Farm", "Iconic", "Trending"];

updatedSampleListings.forEach(listing => {
  listing.category = categories[Math.floor(Math.random() * categories.length)];
});

updatedSampleListings.forEach(listing => {
  listing.country = listing.country.toLowerCase();
});

    await List.insertMany(updatedSampleListings);
    console.log("data intiallized");
}

initDB();

//run this file to initallize data