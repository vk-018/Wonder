import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";

//configuration to access our acc
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

//DEFINE STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
   params: {
    folder: 'Wander',
    allowedFormats: ["png","jpeg","jpg"],
    // public_id: (req, file) => 'computed-filename-using-request',
  },
});


export {cloudinary,storage};

