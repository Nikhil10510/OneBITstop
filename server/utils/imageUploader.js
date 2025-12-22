//import cloudinary module
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadFileToCloudinary(base64Data, folder, height, quality) {
  const options = { folder };
  if (height) {
    options.height = height;
  }
  if (quality) {
    options.quality = quality;
  }
  options.resource_type = "auto";

  try {
    // Upload base64 data to Cloudinary
    const result = await cloudinary.v2.uploader.upload(base64Data, options);
    return result;
  } catch (error) {
    // Handle errors
    // console.error("Error uploading to Cloudinary:", error.message);
    throw error;
  }
}

export default uploadFileToCloudinary;