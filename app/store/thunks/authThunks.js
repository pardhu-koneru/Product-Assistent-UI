import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/services/axiosInstance";

// ─────────────────────────────────────────────────────────────────────
//  Auth Thunks
//  All authentication-related async operations.
// ─────────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * POST /auth/register/
 *
 * @param {Object} payload - { email, password, username?, first_name, last_name, phone_number }
 * @returns {{ msg: string, token: string }}
 */
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/register/", payload);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Registration failed"
      );
    }
  }
);

/**
 * Login user with email & password.
 * POST /auth/login/   → returns { access, refresh }
 * GET  /auth/me/      → returns user profile (chained automatically)
 *
 * The backend login endpoint only returns tokens, so we chain
 * a GET /auth/me/ call to fetch user info (id, email, role, etc.).
 *
 * On success → stores tokens in localStorage.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {{ access: string, refresh: string, user: Object }}
 */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login/", {
        email,
        password,
      });

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // Fetch user profile with the new token
      const userRes = await axiosInstance.get("/auth/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });

      return {
        access: data.access,
        refresh: data.refresh,
        user: userRes.data,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Login failed"
      );
    }
  }
);

/**
 * Logout current user.
 * POST /auth/logout/
 *
 * Sends refresh token in body. Clears localStorage regardless of success/failure.
 *
 * @returns {null}
 */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const refresh =
        auth.refreshToken || localStorage.getItem("refreshToken");
      await axiosInstance.post("/auth/logout/", { refresh });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return null;
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return rejectWithValue(
        err.response?.data?.error || err.message || "Logout failed"
      );
    }
  }
);

/**
 * Fetch the currently authenticated user profile.
 * GET /auth/me/
 *
 * Called on app boot to restore session from existing localStorage tokens.
 *
 * @returns {{ id, email, username, first_name, last_name, phone_number, email_verified, role }}
 */
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/auth/me/");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to fetch user"
      );
    }
  }
);

/**
 * Verify email with a verification token.
 * POST /auth/verify_email/
 *
 * @param {{ token: string }} payload
 * @returns {{ msg: string }}
 */
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ token }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/verify_email/", {
        token,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Email verification failed"
      );
    }
  }
);

/**
 * Resend email verification link.
 * POST /auth/resend_verification_email/
 *
 * @param {{ email: string }} payload
 * @returns {{ msg: string }}
 */
export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerificationEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/auth/resend_verification_email/",
        { email }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to resend verification email"
      );
    }
  }
);
