import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export const cloudinaryConnect = () =>{
    try {
        // Configuring Cloudinary
        cloudinary.config(
            {
                cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
                api_key:process.env.CLOUDINARY_API_KEY,
                api_secret:process.env.CLOUDINARY_API_SECRET,
            }
        )
    } catch (error) {
        console.log(error);
    }
}