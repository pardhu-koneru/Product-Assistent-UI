import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/services/axiosInstance";

// ─────────────────────────────────────────────────────────────────────
//  Admin Products Thunks
//  CRUD + AI processing for admin-only product management.
// ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all products (admin, includes inactive).
 * GET /admin/products/
 *
 * @param {{ isActive?: boolean, categoryId?: string, search?: string, ordering?: string, inStock?: boolean }} params
 * @returns {Array<ProductSerializer>}
 */
export const adminFetchProducts = createAsyncThunk(
  "adminProducts/adminFetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = {};
      if (params.isActive !== undefined) queryParams.is_active = params.isActive;
      if (params.categoryId) queryParams.category_id = params.categoryId;
      if (params.search) queryParams.search = params.search;
      if (params.ordering) queryParams.ordering = params.ordering;
      if (params.inStock !== undefined) queryParams.in_stock = params.inStock;

      const { data } = await axiosInstance.get("/admin/products/", {
        params: queryParams,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch products"
      );
    }
  }
);

/**
 * Create a new product.
 * POST /admin/products/
 *
 * @param {Object} productData - { title, description, brand?, category (uuid), price, currency?, stock_quantity, is_active, attributes?: [{ key, value }] }
 * @returns {ProductSerializer}
 */
export const adminCreateProduct = createAsyncThunk(
  "adminProducts/adminCreateProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/admin/products/",
        productData
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data ||
          err.message ||
          "Failed to create product"
      );
    }
  }
);

/**
 * Partial update a product.
 * PATCH /admin/products/{id}/
 *
 * @param {{ id: string, ...updates }} payload - id + any fields to update
 * @returns {ProductSerializer}
 */
export const adminUpdateProduct = createAsyncThunk(
  "adminProducts/adminUpdateProduct",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(
        `/admin/products/${id}/`,
        updates
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data ||
          err.message ||
          "Failed to update product"
      );
    }
  }
);

/**
 * Delete a product.
 * DELETE /admin/products/{id}/
 *
 * @param {string} id - Product UUID
 * @returns {string} The deleted product's id
 */
export const adminDeleteProduct = createAsyncThunk(
  "adminProducts/adminDeleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/products/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to delete product"
      );
    }
  }
);

/**
 * Add attributes to a product.
 * POST /admin/products/{id}/add_attributes/
 *
 * @param {{ id: string, attributes: Object }} payload - e.g. { id, attributes: { ram: "16GB", color: "red" } }
 * @returns {ProductDetailSerializer}
 */
export const adminAddAttributes = createAsyncThunk(
  "adminProducts/adminAddAttributes",
  async ({ id, attributes }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/admin/products/${id}/add_attributes/`,
        { attributes }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to add attributes"
      );
    }
  }
);

/**
 * Upload an image for a product.
 * POST /admin/products/{id}/upload_image/
 *
 * @param {{ id: string, formData: FormData }} payload - FormData must contain `image` field; optional `alt_text`, `is_primary`
 * @returns {{ detail: string, image_id: string, productId: string }}
 */
export const adminUploadImage = createAsyncThunk(
  "adminProducts/adminUploadImage",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/admin/products/${id}/upload_image/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return { ...data, productId: id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to upload image"
      );
    }
  }
);

/**
 * Toggle product active/inactive status.
 * POST /admin/products/{id}/toggle_active/
 *
 * @param {string} id - Product UUID
 * @returns {{ detail: string, is_active: boolean, id: string }}
 */
export const adminToggleActive = createAsyncThunk(
  "adminProducts/adminToggleActive",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/admin/products/${id}/toggle_active/`
      );
      return { ...data, id };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to toggle product status"
      );
    }
  }
);

/**
 * Fetch aggregated product statistics.
 * GET /admin/products/stats/
 *
 * @returns {{ total_products, active_products, in_stock_products, products_with_ratings }}
 */
export const adminFetchStats = createAsyncThunk(
  "adminProducts/adminFetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/admin/products/stats/");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch stats"
      );
    }
  }
);

/**
 * Start AI processing for a single product (Celery task).
 * POST /admin/products/{id}/process_ai/
 *
 * @param {string} id - Product UUID
 * @returns {{ status, message, task_id, product_id, check_status_url }}
 */
export const adminProcessAI = createAsyncThunk(
  "adminProducts/adminProcessAI",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/admin/products/${id}/process_ai/`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to start AI processing"
      );
    }
  }
);

/**
 * Poll the status of a single-product AI task.
 * GET /admin/products/{id}/ai_status/?task_id={taskId}
 *
 * @param {{ id: string, taskId: string }} payload
 * @returns {{ status: 'pending'|'processing'|'completed'|'failed', message, result? }}
 */
export const adminPollAIStatus = createAsyncThunk(
  "adminProducts/adminPollAIStatus",
  async ({ id, taskId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/admin/products/${id}/ai_status/`,
        { params: { task_id: taskId } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to check AI status"
      );
    }
  }
);

/**
 * Start batch AI processing for multiple products.
 * POST /admin/products/batch_process_ai/
 *
 * @param {string[]} productIds - Array of product UUIDs
 * @returns {{ status, message, task_id, product_count, check_status_url }}
 */
export const adminBatchProcessAI = createAsyncThunk(
  "adminProducts/adminBatchProcessAI",
  async (productIds, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/admin/products/batch_process_ai/",
        { product_ids: productIds }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to start batch AI processing"
      );
    }
  }
);

/**
 * Poll the status of a batch AI task.
 * GET /admin/products/batch_ai_status/?task_id={taskId}
 *
 * @param {string} taskId
 * @returns {{ status: 'pending'|'processing'|'completed'|'failed', message, result? }}
 */
export const adminPollBatchStatus = createAsyncThunk(
  "adminProducts/adminPollBatchStatus",
  async (taskId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        "/admin/products/batch_ai_status/",
        { params: { task_id: taskId } }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to check batch AI status"
      );
    }
  }
);
