import Attendance from "../models/attendance.model.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";

// Get all attendance records for a user (all subjects)
export const getUserAttendance = async (req, res) => {
  try {
    const { userId } = req.params;

    if(!userId){
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    
    const records = await Attendance.find({ userId });

    return res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: records,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get attendance for a specific subject for a user
export const getSubjectAttendance = async (req, res) => {
  try {
    const { userId, subject } = req.params;

    if(!userId || !subject){
      return res.status(400).json({
        success: false,
        message: "User ID and subject are required"
      });
    }

    const record = await Attendance.findOne({ userId, subject });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subject attendance fetched successfully",
      data: record,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Create or update attendance status for a specific date & subject
export const addSubject = async (req, res) => {
  try {
    const { subject } = req.body;
    const userId = req.user?._id;
    if(!userId || !subject){
      return res.status(400).json({
        success: false,
        message: "User ID and subject are required"
      });
    }

    const record = await Attendance.findOne({ userId, subject: subject.toUpperCase() });
    if(record){
      return res.status(400).json({
        success: false,
        message: "Subject already exists"
      });
    }

    const newRecord = new Attendance({ userId, subject: subject.toUpperCase() });
    await newRecord.save();

    const user = await User.findByIdAndUpdate(userId, {
      $push: {
        attendanceModel: newRecord._id
      }
    });

    return res.status(200).json({
      success: true,
      message: "Subject added successfully",
      data: newRecord,
    });
  } catch (err) {
    return res.status(500).json({
      success: false, 
      message: "Internal Server Error",
    });
  }
};

export const upsertAttendance = async (req, res) => {
  try {
    const { subject, date, status } = req.body;
    const userId = req.user?._id;

    if(!userId || !subject || !date || !status){
      return res.status(400).json({
        success: false,
        message: "User ID, subject, date, and status are required"
      });
    }

    if (!["present", "absent", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const upperCaseSubject = subject.toUpperCase(); // Convert subject to uppercase

    const record = await Attendance.findOneAndUpdate(
      { userId, subject: upperCaseSubject },
      { $set: { [`records.${date}`]: status, subject: upperCaseSubject } },
      { upsert: true, new: true }
    );

    const user = await User.findByIdAndUpdate(userId, {
      $push: {
        attendanceModel: record._id
      }
    });

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      data: record,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteSubjectForUser = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { subject } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing",
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    const result = await Attendance.deleteOne({
      userId: new mongoose.Types.ObjectId(userId), // <-- Use `new` here
      subject,
    });

    const user = await User.findByIdAndUpdate(userId, {
      $pull: {
        attendanceModel: result._id
      }
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Subject not found or already deleted",
        });
    }

    return res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// controllers/attendance.controller.js
export const clearAllAttendance = async (req, res) => {
  try {
    const result = await Attendance.deleteMany({});

    const user = await User.updateMany({}, { $pull: { attendanceModel: { $in: result.map(item => item._id) } } });

    if(user.modifiedCount === 0){
      return res.status(404).json({
        success: false,
        message: "No attendance records found"
      });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: `Deleted ${result.deletedCount} attendance records`,
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
