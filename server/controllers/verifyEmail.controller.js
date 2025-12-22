import User from "../models/user.model.js";

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Verification token is missing", success: false });
    }

    // 1. Find the user with a valid, non-expired token
    const user = await User.findOne({ 
      verificationToken: token,
      tokenExpires: { $gt: Date.now() } // This replaces your manual expiry check
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Token is invalid or has expired", 
        success: false 
      });
    }

    // 2. Update the fields
    user.isVerified = true;
    user.verificationToken = undefined;
    user.tokenExpires = undefined;

    // 3. Save the user
    // NOTE: Ensure your User Schema has: if (!this.isModified('password')) return next();
    await user.save();

    return res.status(200).json({ 
      message: "Email verified successfully! You can now log in.", 
      success: true 
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ 
      message: "Internal server error during verification", 
      success: false, 
      error: error.message 
    });
  }
};