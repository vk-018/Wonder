//joi is used for server side validation -> so the data sent is always inline with schema defined in mongodb
import Joi from "joi";

const listingschema= Joi.object({   //name schema

    //joi expects an object with following keys
        title:Joi.string().required(),                   //this key should be a string and required
        description: Joi.string().required(),
        category: Joi.string().required(),
        image: Joi.string().allow("",null),     //allow null values
        price: Joi.number().required().min(0), //only positive values
        location: Joi.string().required(),
        country: Joi.string().required(),


    }
    
);

const reviewschema= Joi.object({   //name schema

    //joi expects an object with following keys
        comment:Joi.string().required(),                   //this key should be a string and required
        rating: Joi.number().required().min(1).max(5)
    }   
);


export {listingschema,reviewschema}