import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/services/axiosInstance";

// ─────────────────────────────────────────────────────────────────────
//  Admin Categories Thunks
//  Category management operations (admin only).
//  All endpoints require is_staff = true.
//  NOTE: Backend uses SLUG (not id) as the lookup field for categories.
// ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all categories (admin, includes inactive).
 * GET /admin/categories/
 *
 * @param {{ isActive?: boolean, parentId?: string, search?: string, ordering?: string }} params
 * @returns {Array<CategorySerializer>}
 */
export const adminFetchCategories = createAsyncThunk(
  "adminCategories/adminFetchCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = {};
      if (params.isActive !== undefined) queryParams.is_active = params.isActive;
      if (params.parentId) queryParams.parent_id = params.parentId;
      if (params.search) queryParams.search = params.search;
      if (params.ordering) queryParams.ordering = params.ordering;

      const { data } = await axiosInstance.get("/admin/categories/", {
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
 * Fetch a single category by slug.
 * GET /admin/categories/{slug}/
 *
 * @param {string} slug
 * @returns {CategorySerializer}
 */
export const adminFetchCategoryBySlug = createAsyncThunk(
  "adminCategories/adminFetchCategoryBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/admin/categories/${slug}/`);
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
 * Create a new category.
 * POST /admin/categories/
 *
 * If sending an image, pass a FormData instance.
 *
 * @param {Object|FormData} categoryData - { name, slug, description?, image?, parent?, is_active }
 * @returns {CategorySerializer}
 */
export const adminCreateCategory = createAsyncThunk(
  "adminCategories/adminCreateCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const isFormData = categoryData instanceof FormData;
      const { data } = await axiosInstance.post(
        "/admin/categories/",
        categoryData,
        isFormData
          ? { headers: { "Content-Type": "multipart/form-data" } }
          : {}
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data ||
          err.message ||
          "Failed to create category"
      );
    }
  }
);

/**
 * Update a category (partial).
 * PATCH /admin/categories/{slug}/
 *
 * @param {{ slug: string, formData?: FormData, ...updates }} payload
 * @returns {CategorySerializer}
 */
export const adminUpdateCategory = createAsyncThunk(
  "adminCategories/adminUpdateCategory",
  async ({ slug, ...updates }, { rejectWithValue }) => {
    try {
      const isFormData = updates.formData instanceof FormData;
      const payload = isFormData ? updates.formData : updates;
      const config = isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

      const { data } = await axiosInstance.patch(
        `/admin/categories/${slug}/`,
        payload,
        config
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data ||
          err.message ||
          "Failed to update category"
      );
    }
  }
);

/**
 * Delete a category.
 * DELETE /admin/categories/{slug}/
 *
 * Will fail (400) if the category has children.
 *
 * @param {string} slug
 * @returns {string} The deleted category's slug
 */
export const adminDeleteCategory = createAsyncThunk(
  "adminCategories/adminDeleteCategory",
  async (slug, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/categories/${slug}/`);
      return slug;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to delete category"
      );
    }
  }
);

/**
 * Deactivate a category and all its children.
 * POST /admin/categories/{slug}/deactivate/
 *
 * @param {string} slug
 * @returns {{ detail, data: CategorySerializer }}
 */
export const adminDeactivateCategory = createAsyncThunk(
  "adminCategories/adminDeactivateCategory",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/admin/categories/${slug}/deactivate/`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to deactivate category"
      );
    }
  }
);

/**
 * Activate a category.
 * POST /admin/categories/{slug}/activate/
 *
 * @param {string} slug
 * @returns {{ detail, data: CategorySerializer }}
 */
export const adminActivateCategory = createAsyncThunk(
  "adminCategories/adminActivateCategory",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/admin/categories/${slug}/activate/`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to activate category"
      );
    }
  }
);

/**
 * Fetch category statistics.
 * GET /admin/categories/stats/
 *
 * @returns {{ total_categories, active_categories, root_categories, categories_with_children }}
 */
export const adminFetchCategoryStats = createAsyncThunk(
  "adminCategories/adminFetchCategoryStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/admin/categories/stats/");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch category stats"
      );
    }
  }
);

/**
 * Fetch the nested category tree hierarchy.
 * GET /admin/categories/tree/
 *
 * @returns {{ tree: Array<{ id, name, slug, children: [...] }> }}
 */
export const adminFetchCategoryTree = createAsyncThunk(
  "adminCategories/adminFetchCategoryTree",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/admin/categories/tree/");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch category tree"
      );
    }
  }
);
