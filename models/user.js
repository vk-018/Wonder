import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
// //You're free to define your User how you like. Passport-Local Mongoose will add a username, 
// // hash and salt field to store the username, the hashed password and the salt value.


const userSchema= new mongoose.Schema({
    // username :{
    //     type : String,
    //     required: true
    // },
    // password :{
    //     type : String,
    //     required: true
    // },
    //username and password not needed as passport local mongoose will automaticllay create it
    email : {
        type : String,
        required : true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);    //plugin it inorder to use
const User= mongoose.model("User",userSchema);


export default User

