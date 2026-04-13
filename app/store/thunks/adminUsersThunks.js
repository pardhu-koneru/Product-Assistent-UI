import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/services/axiosInstance";

// ─────────────────────────────────────────────────────────────────────
//  Admin Users Thunks
//  User management operations (admin only).
//  All endpoints require is_staff = true.
// ─────────────────────────────────────────────────────────────────────

/**
 * Fetch paginated list of all users.
 * GET /admin/users/
 *
 * Supports: ?search, ?ordering, ?page, ?page_size
 * Response: { count, next, previous, results: [UserSerializer] }
 *
 * @param {{ search?, ordering?, page?, pageSize? }} params
 * @returns {{ count, next, previous, results, currentPage }}
 */
export const adminFetchUsers = createAsyncThunk(
  "adminUsers/adminFetchUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = {};
      if (params.search) queryParams.search = params.search;
      if (params.ordering) queryParams.ordering = params.ordering;
      if (params.page) queryParams.page = params.page;
      if (params.pageSize) queryParams.page_size = params.pageSize;

      const { data } = await axiosInstance.get("/admin/users/", {
        params: queryParams,
      });
      return { ...data, currentPage: params.page || 1 };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch users"
      );
    }
  }
);

/**
 * Fetch a single user by UUID.
 * GET /admin/users/{id}/
 *
 * @param {string} id
 * @returns {{ id, email, username, first_name, last_name, phone_number, email_verified, is_active, is_staff, role, created_at }}
 */
export const adminFetchUserById = createAsyncThunk(
  "adminUsers/adminFetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/admin/users/${id}/`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch user"
      );
    }
  }
);

/**
 * Partial update a user.
 * PATCH /admin/users/{id}/
 *
 * @param {{ id: string, ...updates }} payload
 * @returns {UserSerializer}
 */
export const adminUpdateUser = createAsyncThunk(
  "adminUsers/adminUpdateUser",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/users/${id}/`,
        updates
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data ||
          err.message ||
          "Failed to update user"
      );
    }
  }
);

/**
 * Delete a user.
 * DELETE /admin/users/{id}/
 *
 * @param {string} id
 * @returns {string} The deleted user's id
 */
export const adminDeleteUser = createAsyncThunk(
  "adminUsers/adminDeleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/users/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to delete user"
      );
    }
  }
);

/**
 * Activate a user account.
 * PATCH /admin/users/{id}/activate/
 *
 * @param {string} id
 * @returns {{ id, msg }}
 */
export const adminActivateUser = createAsyncThunk(
  "adminUsers/adminActivateUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/users/${id}/activate/`
      );
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to activate user"
      );
    }
  }
);

/**
 * Deactivate a user account.
 * PATCH /admin/users/{id}/deactivate/
 *
 * @param {string} id
 * @returns {{ id, msg }}
 */
export const adminDeactivateUser = createAsyncThunk(
  "adminUsers/adminDeactivateUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/users/${id}/deactivate/`
      );
      return { id, ...data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to deactivate user"
      );
    }
  }
);

/**
 * Promote a user to staff/admin.
 * POST /admin/make_staff/
 *
 * @param {string} email
 * @returns {{ email, msg }}
 */
export const adminMakeStaff = createAsyncThunk(
  "adminUsers/adminMakeStaff",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/admin/make_staff/", {
        email,
      });
      return { email, ...data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          err.message ||
          "Failed to promote user"
      );
    }
  }
);
