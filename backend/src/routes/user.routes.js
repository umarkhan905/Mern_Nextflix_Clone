import { Router } from "express";

import {
  signupUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  deleteUserAccount,
  verifyUser,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
} from "../controllers/user.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/verify-email").post(verifyUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/delete-account").delete(verifyJWT, deleteUserAccount);
router.route("/resend-email").get(verifyJWT, resendVerificationEmail);

export default router;
