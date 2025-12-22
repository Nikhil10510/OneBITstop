import SellBuy from "../models/sellbuylistings.model.js";
import uploadFileToCloudinary from "../utils/imageUploader.js";

export const createListing = async (req, res) => {
  try {

    const {
      title,
      price,
      category,
      description,
      whatsappNumber,
      email
    } = req.body;

    // req.files contains the uploaded files from our middleware
    const files = req.files || [];

    if(!title || !price || !category || !description || !whatsappNumber || !email) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    if(files.length === 0) {
      return res.status(400).json({ message: "At least one photo is required", success: false });
    }

    // Upload all files to Cloudinary
    const uploadPromises = files.map(file => 
      uploadFileToCloudinary(file.base64Data, process.env.CLOUDINARY_FOLDER_NAME)
    );
    
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(result => result.secure_url);

    const newListing = new SellBuy({
      title,
      price,
      category,
      description,
      whatsappNumber,
      email,
      photo: imageUrls[0], // Main photo
      additionalPhotos: imageUrls.slice(1), // Additional photos
    });

    const savedListing = await newListing.save();

    res.status(201).json({
      message: 'Listing created successfully',
      data: savedListing,
    });
  } catch (error) {
    // console.error('Error creating listing:', error);
    res.status(400).json({
      message: 'Failed to create listing',
      error: error.message,
    });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const listings = await SellBuy.find().sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving listings',
      error: error.message,
    });
  }
};

export const deleteListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSellBuy = await SellBuy.findByIdAndDelete(id);

    if (!deletedSellBuy) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete listing',
      error: error.message,
    });
  }
};
