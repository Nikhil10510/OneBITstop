import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req?.cookies?.token 
                      || req?.body?.token 
                      || req?.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "User not authenticated", success: false });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = { _id: decoded.userId };
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token is Invalid", success: false });
    }

  } catch (error) {
    return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
  }
};

export default isAuthenticated;
