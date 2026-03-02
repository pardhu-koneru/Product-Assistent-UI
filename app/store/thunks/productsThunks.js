import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/services/axiosInstance";

// ─────────────────────────────────────────────────────────────────────
//  Products Thunks (Public)
//  Read-only operations for customer-facing product browsing.
// ─────────────────────────────────────────────────────────────────────

/** Convert filters state object into API query params */
function filtersToParams(filters, page = 1) {
  const params = {};
  if (filters.category) params.category = filters.category;
  if (filters.priceMin !== null) params.price_min = filters.priceMin;
  if (filters.priceMax !== null) params.price_max = filters.priceMax;
  if (filters.brand) params.brand = filters.brand;
  if (filters.inStock !== null) params.in_stock = filters.inStock;
  if (filters.rating !== null) params.rating_min = filters.rating;
  if (filters.search) params.search = filters.search;
  if (page > 1) params.page = page;
  return params;
}

/**
 * Fetch products with the current filter & pagination state.
 * GET /products/
 *
 * Reads filters from `state.products.filters` and page from `state.products.pagination.currentPage`.
 *
 * @returns {Array<{ id, title, price, currency, rating_avg, rating_count, is_active, primary_image }>}
 */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { products } = getState();
      const params = filtersToParams(
        products.filters,
        products.pagination.currentPage
      );
      const { data } = await axiosInstance.get("/products/", { params });
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
 * Fetch a single product by UUID.
 * GET /products/{id}/
 *
 * @param {string} id - Product UUID
 * @returns {{ id, title, description, brand, category, category_name, price, currency, stock_quantity, is_active, rating_avg, rating_count, attributes, images, created_at, updated_at }}
 */
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/products/${id}/`);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch product"
      );
    }
  }
);

/**
 * Fetch products filtered by category slug.
 * GET /products/by_category/?slug={slug}
 *
 * @param {string} slug - Category slug
 * @returns {Array<ProductListSerializer>}
 */
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/products/by_category/", {
        params: { slug },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch products by category"
      );
    }
  }
);

/**
 * Search products by query string. Minimum 2 characters.
 * GET /products/search/?q={query}
 *
 * @param {string} query
 * @returns {Array<ProductListSerializer>}
 */
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/products/search/", {
        params: { q: query },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to search products"
      );
    }
  }
);

/**
 * Fetch featured products (rating_avg ≥ 4.0, in stock, top 10).
 * GET /products/featured/
 *
 * @returns {Array<ProductListSerializer>}
 */
export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/products/featured/");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch featured products"
      );
    }
  }
);

/**
 * Fetch the 10 most recently created products.
 * GET /products/new_arrivals/
 *
 * @returns {Array<ProductListSerializer>}
 */
export const fetchNewArrivals = createAsyncThunk(
  "products/fetchNewArrivals",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/products/new_arrivals/");
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch new arrivals"
      );
    }
  }
);

/**
 * Fetch recommended products (high rating_count, sorted by rating_avg).
 * GET /products/recommendations/?limit={limit}
 *
 * @param {number} [limit=10]
 * @returns {Array<ProductListSerializer>}
 */
export const fetchRecommendations = createAsyncThunk(
  "products/fetchRecommendations",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/products/recommendations/", {
        params: { limit },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch recommendations"
      );
    }
  }
);

/**
 * Fetch attributes for a specific product.
 * GET /products/{id}/attributes/
 *
 * @param {string} id - Product UUID
 * @returns {{ product_id, product_title, attributes: Array<{ id, key, value }> }}
 */
export const fetchProductAttributes = createAsyncThunk(
  "products/fetchProductAttributes",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/products/${id}/attributes/`
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch product attributes"
      );
    }
  }
);
