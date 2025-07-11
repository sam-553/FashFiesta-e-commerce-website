import HandleError from "../utils/handleError.js";
import handleasyncError from "./handleasyncError.js";
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";


// Middleware to verify JWT token and attach user to request
const verifyUserAuth = handleasyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new HandleError('Authentication is missing! Please login to continue.', 401));
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    return next(new HandleError('Invalid or expired token. Please login again.', 401));
  }
});

// Role-based access middleware
const rolebasedAccess = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new HandleError(`Role '${req.user.role}' is not allowed to access this resource`, 403)
      );
    }
    next();
  };
};

export { verifyUserAuth, rolebasedAccess };
