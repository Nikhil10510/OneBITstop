import Carpool from '../models/Carpool.model.js';
import User from '../models/user.model.js';

export const createCarpool = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropLocation,
      travelDate,
      departureTime,
      seatsAvailable,
      additionalNotes,
      contactNumber,
      email
    } = req.body;


    const userId = req.user?._id;
    
    if(!userId){
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    //check if all fields are present
    if(!pickupLocation || !dropLocation || !travelDate || !departureTime || !seatsAvailable || !contactNumber || !email){
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const carpool = new Carpool({
      pickupLocation,
      dropLocation,
      travelDate,
      departureTime,
      seatsAvailable,
      additionalNotes,
      contactNumber,
      email,
      userId
    });

    const user = await User.findByIdAndUpdate(userId, {
      $push: {
        carpools: carpool._id
      }
    });


    await carpool.save();
    res.status(201).json({ 
      success: true,
      message: 'Carpool listing created successfully',
      data: carpool
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create carpool listing',
      error: error.message
    });
  }
};

export const getAllCarpools = async (req, res) => {
  try {
    const carpools = await Carpool.find().sort({ travelDate: 1 });
    res.status(200).json({
      success: true,
      message: 'Carpool listings fetched successfully',
      data: carpools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching carpool listings',
      error: error.message
    });
  }
};

export const deleteCarpoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Carpool.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Carpool listing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Carpool listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting carpool listing',
      error: error.message
    });
  }
};
