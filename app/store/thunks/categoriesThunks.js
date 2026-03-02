import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/services/axiosInstance";

// ─────────────────────────────────────────────────────────────────────
//  Categories Thunks (Public)
//  Read-only operations for customer-facing category browsing.
// ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all active categories (flat list).
 * GET /categories/
 *
 * @param {{ rootOnly?: boolean }} params - Optional. Pass { rootOnly: true } for root categories only.
 * @returns {Array<{ id, name, slug, image, is_active }>}
 */
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = {};
      if (params.rootOnly) queryParams.root_only = "true";

      const { data } = await axiosInstance.get("/categories/", {
        params: queryParams,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch categories"
      );
    }
  }
);

/**
 * Fetch a single category by its slug.
 * GET /categories/{slug}/
 *
 * @param {string} slug
 * @returns {{ id, name, slug, description, image, parent, parent_name, is_active, children, created_at, updated_at }}
 */
export const fetchCategoryBySlug = createAsyncThunk(
  "categories/fetchCategoryBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/categories/${slug}/`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch category"
      );
    }
  }
);

/**
 * Fetch subcategories for a given parent category.
 * GET /categories/{slug}/subcategories/
 *
 * @param {string} slug - Parent category slug
 * @returns {Array<{ id, name, slug, image, is_active }>}
 */
export const fetchSubcategories = createAsyncThunk(
  "categories/fetchSubcategories",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/categories/${slug}/subcategories/`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch subcategories"
      );
    }
  }
);
