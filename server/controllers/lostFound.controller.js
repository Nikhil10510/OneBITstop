import LostFoundItem from "../models/LostFoundItem.model.js";
import User from "../models/user.model.js";
import uploadFileToCloudinary from "../utils/imageUploader.js";

// Add new lost/found item
export const addItem = async (req, res) => {
  try {

    const { title, description, contact, whatsapp, date } = req.body;

    if (!title || !description || !contact || !whatsapp || !date) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    // Get user from authentication
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemDate = new Date(date);
    const today = new Date();

    if (itemDate > today) {
      return res.status(400).json({ message: "Date cannot be in the future." });
    }

    // req.files contains the uploaded files from our middleware
    const files = req.files || [];

    if(files.length === 0) {
      return res.status(400).json({ message: "At least one photo is required", success: false });
    }

    // Upload all files to Cloudinary
    const uploadPromises = files.map(file => 
      uploadFileToCloudinary(file.base64Data, process.env.CLOUDINARY_FOLDER_NAME)
    );
    
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(result => result.secure_url);

    const newItem = new LostFoundItem({
      title,
      description,
      contact,
      whatsapp,
      date: itemDate,
      photo: imageUrls[0], // Main photo
      additionalPhotos: imageUrls.slice(1), // Additional photos
      user: user._id, // Set the user reference
    });

    const savedItem = await newItem.save();

    // Update user's lost and found listings (if the field exists)
    if (user.lostAndFoundListings) {
      user.lostAndFoundListings.push(savedItem._id);
      await user.save();
    }

    res.status(201).json(
      {
        message: "Item added successfully.",
        success: true,
        data: savedItem,
      }
    );
  } catch (error) {
    // console.error("Error adding lost/found item:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Get all lost/found items
export const getItems = async (req, res) => {
  try {
    const items = await LostFoundItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    // console.error("Error fetching lost/found items:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Delete lost/found item by id
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await LostFoundItem.findByIdAndDelete(id);
    res.json({ message: "Item deleted successfully." });
  } catch (error) {
    // console.error("Error deleting lost/found item:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
