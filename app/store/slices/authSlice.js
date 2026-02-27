import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchCurrentUser,
  verifyEmail,
  resendVerificationEmail,
} from "~/store/thunks/authThunks";

/**
 * Auth state shape:
 * @property {Object|null} user              – { id, email, username, first_name, last_name, phone_number, email_verified, role }
 * @property {string|null} accessToken
 * @property {string|null} refreshToken
 * @property {boolean}     isAuthenticated
 * @property {boolean}     isAdmin           – derived from user.role === "admin"
 * @property {boolean}     loading
 * @property {string|null} error
 * @property {boolean}     emailVerificationSent
 */
const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
  emailVerificationSent: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Reset error to null */
    clearError(state) {
      state.error = null;
    },

    /**
     * Manually set access/refresh tokens.
     * Used by the axios interceptor after a successful token refresh.
     */
    setTokens(state, action) {
      const { access, refresh } = action.payload;
      if (access) {
        state.accessToken = access;
        localStorage.setItem("accessToken", access);
      }
      if (refresh) {
        state.refreshToken = refresh;
        localStorage.setItem("refreshToken", refresh);
      }
    },

    /** Hard-reset auth state (when token refresh fails in interceptor) */
    forceLogout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.loading = false;
      state.error = null;
      state.emailVerificationSent = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    // ── registerUser ─────────────────────────────────────────────
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.emailVerificationSent = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── loginUser ────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { access, refresh, user } = action.payload;
        state.loading = false;
        state.accessToken = access;
        state.refreshToken = refresh;
        state.user = user;
        state.isAuthenticated = true;
        state.isAdmin = user.role === "admin";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // ── logoutUser ───────────────────────────────────────────────
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.loading = false;
        state.error = null;
        state.emailVerificationSent = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Clear state even on failure (localStorage already wiped in thunk)
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchCurrentUser ─────────────────────────────────────────
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.role === "admin";
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      });

    // ── verifyEmail ──────────────────────────────────────────────
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        if (state.user) {
          state.user.email_verified = true;
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── resendVerificationEmail ──────────────────────────────────
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
        state.emailVerificationSent = true;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setTokens, forceLogout } = authSlice.actions;
export default authSlice.reducer;
