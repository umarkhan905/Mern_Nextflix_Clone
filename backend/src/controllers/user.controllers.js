import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmails.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "../utils/emailTemplates.js";
import { ENV_VARS } from "../config/envVars.config.js";

const cookiesOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
      return res.status(401).json(new ApiError(401, "All fields are required"));
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(401)
        .json(new ApiError(401, "Please enter a valid email address"));
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res
        .status(401)
        .json(new ApiError(401, "User already exists with this email"));
    }

    const usernameRegex = /^[a-z0-9]{4,}$/;
    if (!usernameRegex.test(username)) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            "Username can contains lowercase and numbers only and at least 4 characters long"
          )
        );
    }

    const isUsernameTaken = await User.findOne({ username });
    if (isUsernameTaken) {
      return res.status(401).json(new ApiError(401, "Username already taken"));
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
          )
        );
    }

    // Choose a random profile picture
    const DEFAULT_PROFILE_PICTURE = [
      "/avatar1.png",
      "/avatar2.png",
      "/avatar3.png",
    ];

    const profilePicture =
      DEFAULT_PROFILE_PICTURE[
        Math.floor(Math.random() * DEFAULT_PROFILE_PICTURE.length)
      ];

    const user = new User({
      username,
      email,
      password,
      profilePicture,
    });

    const token = user.createJWT();
    const verificationToken = user.createVerificationCode();
    const emailError = await sendEmail(
      user.email,
      "Verify Your Email Address",
      VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ).replace("{username}", user.username)
    );

    if (emailError) {
      return res
        .status(emailError.statusCode)
        .json(
          new ApiError(
            emailError.statusCode,
            emailError.message,
            emailError.name
          )
        );
    }

    await user.save({ validateBeforeSave: false });

    return res
      .cookie("token", token, cookiesOptions)
      .status(201)
      .json(
        new ApiResponse(
          201,
          { ...user._doc, password: undefined, token },
          "User signup successfully. Check your email for verification code"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const verifyUser = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    if (!verificationCode) {
      return res
        .status(401)
        .json(new ApiError(401, "Verification code is required"));
    }

    const user = await User.findOne({
      verificationCode,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, "Incorrect verification code or expired"));
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Todo: send welcome email

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...user._doc, password: undefined },
          "User verified successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(401).json(new ApiError(401, "All fields are required"));
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(401)
        .json(new ApiError(401, "Please enter a valid email address"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, "Incorrect email or password"));
    }

    const isPasswordCorrect = await user.isPasswordMatched(password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json(new ApiError(401, "Incorrect email or password"));
    }

    const token = user.createJWT();

    return res
      .cookie("token", token, cookiesOptions)
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...user._doc, password: undefined, token },
          "User logged in successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const logoutUser = async (req, res) => {
  try {
    return res
      .clearCookie("token", cookiesOptions)
      .status(200)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(401)
        .json(new ApiError(401, "Email address is required"));
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(401)
        .json(new ApiError(401, "Please enter a valid email address"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, "User not found with this email address"));
    }

    const passwordResetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const emailError = await sendEmail(
      user.email,
      "Reset Your Password",
      `<a href="${ENV_VARS.FRONTEND_PATH}/reset-password/${passwordResetToken}">Click here to reset your password</a>`
    );

    if (emailError) {
      return res
        .status(emailError.status)
        .json(new ApiError(emailError.status, emailError.message));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Email sent successfully. Check your inbox to reset your password"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const { token } = req.params;

    if (!token) {
      return res
        .status(403)
        .json(new ApiError(403, "Unauthorized: Token is required"));
    }

    if (!(newPassword && confirmPassword)) {
      return res.status(401).json(new ApiError(401, "All fields are required"));
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (
      !passwordRegex.test(newPassword) ||
      !passwordRegex.test(confirmPassword)
    ) {
      return res
        .status(401)
        .json(
          new ApiError(
            401,
            "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
          )
        );
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json(new ApiError(401, "Passwords do not match"));
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid or expired token"));
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const getCurrentUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...req.user._doc, password: undefined },
          "Current user retrieved successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user?._id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User account deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};
const resendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    if (user.isVerified) {
      return res
        .status(200)
        .json(new ApiResponse(200, {}, "User is already verified"));
    }

    const verificationToken = user.createVerificationCode();
    const emailError = await sendEmail(
      user.email,
      "Verify Your Email Address",
      VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ).replace("{username}", user.username)
    );

    if (emailError) {
      return res
        .status(emailError.statusCode)
        .json(
          new ApiError(
            emailError.statusCode,
            emailError.message,
            emailError.name
          )
        );
    }

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Email sent successfully. Check your inbox to verify your email address"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", error.stack));
  }
};

export {
  signupUser,
  verifyUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  deleteUserAccount,
  resendVerificationEmail,
};
