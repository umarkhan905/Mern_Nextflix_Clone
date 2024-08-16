import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,
  resendLoading: false,
  signupLoading: false,
  loginLoading: false,
  verifyLoading: false,
  forgotLoading: false,
  resetLoading: false,
  isAuthenticated: false,
  isForgotFormSubmitted: false,

  signup: async (formData) => {
    set({ error: null, signupLoading: true });
    try {
      const { data } = await axios.post("/api/v1/users/signup", formData);
      set({
        user: data.data,
        signupLoading: false,
        message: data.message,
      });
      toast.success(data.message);
    } catch (error) {
      set({
        error: error.response.data.error,
        user: null,
        signupLoading: false,
      });
      throw error;
    }
  },
  resendEmail: async () => {
    set({ error: null, resendLoading: true });
    try {
      const { data } = await axios.get("/api/v1/users/resend-email");
      set({
        error: null,
        user: data.data,
        resendLoading: false,
        isAuthenticated: true,
      });
      toast.success(data.message);
    } catch (error) {
      set({
        error: error.response.data.error,
        user: null,
        resendLoading: false,
      });
      console.log("Error in resend email: ", error);
      throw error;
    }
  },
  verifyEmail: async (verificationCode) => {
    set({ error: null, verifyLoading: true });
    try {
      const { data } = await axios.post("/api/v1/users/verify-email", {
        verificationCode,
      });
      set({
        error: null,
        user: data.data,
        verifyLoading: false,
        isAuthenticated: true,
      });
      toast.success(data.message);
    } catch (error) {
      set({
        error: error.response.data.error,
        user: null,
        verifyLoading: false,
      });
      console.log("Error in verify email: ", error);
      throw error;
    }
  },
  getCurrentUser: async () => {
    set({ isLoading: true, isCheckingAuth: true });
    try {
      const { data } = await axios.get("/api/v1/users/current-user");
      set({
        user: data.data,
        isLoading: false,
        isCheckingAuth: false,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        isLoading: false,
        isCheckingAuth: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ error: null });
    try {
      const { data } = await axios.post("/api/v1/users/logout");
      set({
        error: null,
        user: null,
        isAuthenticated: false,
      });
      toast.success(data.message);
    } catch (error) {
      set({
        error: error.response.data.error,
        user: null,
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (formData) => {
    set({ error: null, loginLoading: true });
    try {
      const { data } = await axios.post("/api/v1/users/login", formData);
      set({
        user: data.data,
        loginLoading: false,
        message: data.message,
        isAuthenticated: true,
      });
      toast.success(data.message);
    } catch (error) {
      set({
        error: error.response.data.error,
        user: null,
        loginLoading: false,
      });
      throw error;
    }
  },
  forgotPassword: async (email) => {
    set({ error: null, forgotLoading: true });
    try {
      const { data } = await axios.post("/api/v1/users/forgot-password", {
        email,
      });

      toast.success(data.message);
      set({
        error: null,
        message: data.message,
        forgotLoading: false,
        isForgotFormSubmitted: true,
      });
    } catch (error) {
      set({
        error: error.response.data.error,
        forgotLoading: false,
      });
      throw error;
    }
  },
  resetPassword: async (formData, resetToken) => {
    set({ error: null, resetLoading: true });
    try {
      const { data } = await axios.post(
        `/api/v1/users/reset-password/${resetToken}`,
        formData
      );
      set({
        error: null,
        message: data.message,
        resetLoading: false,
      });
      toast.success(data.message);
    } catch (error) {
      set({
        error: error.response.data.error,
        resetLoading: false,
      });
      throw error;
    }
  },
}));
