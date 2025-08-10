//using wrapAsync to avoid writing tey catch block everytime for asynchrous errors
function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{
            next(err);
        });
    }
}

export default wrapAsync