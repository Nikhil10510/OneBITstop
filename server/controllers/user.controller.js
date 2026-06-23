import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as crypto from "node:crypto";
import mailSender from "../utils/mailSender.js";

// REGISTER

// REGISTER
export const registerUser = async (req, res) => {
  try {
    // 1. Only extract what you're actually sending from Frontend
    const { name, email, password, confirmPassword } = req.body;

    // 2. Basic Field Validation (Phone removed)
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        message: "All required fields (name, email, password) must be filled", 
        success: false 
      });
    }

    // 3. Password Match Check
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
      });
    }

    // 4. Regex Validation
    const bitEmailRegex = /^(btech|imh|mca|mba)\d{5}\.\d{2}@bitmesra\.ac\.in$/;
    if (!bitEmailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format. Use your college ID (e.g., btech10467.23@bitmesra.ac.in)",
        success: false,
      });
    }

    // REMOVED: Step 4 (Phone Validation) - This was causing your 500 error!

    // 5. Existing User Check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.isVerified 
          ? "User already exists and is verified. Please log in." 
          : "User already registered but not verified. Please check your email.",
        success: false,
      });
    }

    // 6. Token Generation
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 3600000; // 1 hour

    // 7. Create User (Phone and Year removed)
    const newUser = await User.create({
      name,
      email,
      password, 
      verificationToken,
      tokenExpires,
    });

    // 8. Send Verification Email
    const verifyURL = `${process.env.CLIENT_BASE_URL}/verify-email?token=${verificationToken}`;
    const emailTitle = "Verify Your OneBITstop Account";
    const emailBody = `
      <h1>Welcome to OneBITstop, ${name}!</h1>
      <p>Click the link below to verify your BIT Mesra account:</p>
      <a href="${verifyURL}" style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
    `;

    try {
      await mailSender(newUser.email, emailTitle, emailBody);
    } catch (mailError) {
      console.error("Mail Helper Error during signup:", mailError);
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({
        message: `Failed to send verification email: ${mailError.message}. Please check your credentials or network configuration.`,
        success: false,
        error: mailError.message
      });
    }

    return res.status(201).json({
      message: "Registration successful! Please check your BIT Mesra email to verify your account.",
      success: true,
    });

  } catch (error) {
    console.error("Registration Logic Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
        message: "Email and password are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password",
        message: "User not registered. Please sign up first.",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password",
        message: "Invalid email or password",
        success: false,
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
        message: "Please verify your email before logging in",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      graduatingYear: user.graduatingYear,
      token: token,
      isVerified: user.isVerified, // ✅ This was missing!
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "None", // ⛳ Allows cross-site cookies (required for Vercel <-> Render)
        secure: true, // ⛳ Required for 'SameSite: None' to work properly
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.name}`,
        success: true,
        user: userData,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// GET USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Not authenticated",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        // phone: user.phone,
        // graduatingYear: user.graduatingYear,
        // department: user.department,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve user info",
      success: false,
      error: error.message,
    });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, graduatingYear } = req.body;
    const userId = req.user._id || req.user.id;

    // 1. Use findByIdAndUpdate to bypass the pre-save hook issues
    // 2. runValidators: true ensures the 10-digit phone check still works
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        phone, 
        graduatingYear: graduatingYear ? parseInt(graduatingYear, 10) : undefined 
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    // This will now catch validation errors (like wrong phone format)
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.endsWith("@bitmesra.ac.in")) {
      return res.status(400).json({
        message: "A valid BIT Mesra email is required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "User already verified", success: false });
    }
    // Generate a new token and expiry
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpires = Date.now() + 10*60*1000; // 10 minutes

    user.verificationToken = verificationToken;
    user.tokenExpires = tokenExpires;
    await user.save();

    const verifyURL = `${process.env.CLIENT_BASE_URL}/verify-email?token=${verificationToken}`;

    await mailSender(
      user.email, 
      "Resend: Verify Your Email", 
      `<p>Hi ${user.name},</p>
       <p>Click the link below to verify your account:</p>
       <a href="${verifyURL}">${verifyURL}</a>`
    );
    return res.status(200).json({
      message: "Verification email resent. Please check your inbox.",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordToken = token;
    user.resetPasswordExpires = tokenExpiry;
    await user.save();

    // The frontend route for password reset
    const resetURL = `${process.env.CLIENT_BASE_URL}/reset-password/${token}`;
    
    await mailSender(
      user.email, 
      "Reset Your OneBITstop Password", 
      `<h3>Password Reset Request</h3>
       <p>Hi ${user.name},</p>
       <p>We received a request to reset your password. Click the link below to proceed:</p>
       <a href="${resetURL}" style="background: #e74c3c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
       <p>If you did not request this, please ignore this email. The link will expire in 10 minutes.</p>`
    );

    res.status(200).json({ message: "Password reset link sent to your email", success: true });
  } catch (err) {
    res.status(500).json({ message: "Error sending email", success: false, error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if(!token || !password) {
      return res.status(400).json({
        message: "Token and password are required",
        success: false,
      });
    }
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Not expired
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.password = password; // Hashing should be handled in a pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
