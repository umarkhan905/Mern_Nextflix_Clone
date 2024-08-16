import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ENV_VARS } from "../config/envVars.config.js";
export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(403)
        .json(new ApiError(403, "Unauthorized: No token provided"));
    }

    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    if (!decoded) {
      return res
        .status(403)
        .json(new ApiError(403, "Unauthorized: Invalid token"));
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      return res
        .status(403)
        .json(new ApiError(403, "Unauthorized: User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in verifyJWT", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};
