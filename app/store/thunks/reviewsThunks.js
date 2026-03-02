import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "~/services/axiosInstance";

// ─────────────────────────────────────────────────────────────────────
//  Reviews Thunks
//  Review CRUD, product stats, search, and AI-powered Q&A.
// ─────────────────────────────────────────────────────────────────────

/**
 * Fetch reviews for a product.
 * GET /reviews/?product_id={id}&rating={n}
 *
 * @param {{ productId: string, rating?: number }} params
 * @returns {Array<{ id, rating, title, text, user_email, product_title, helpful_count, created_at, updated_at }>}
 */
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async ({ productId, rating }, { rejectWithValue }) => {
    try {
      const params = { product_id: productId };
      if (rating) params.rating = rating;
      const { data } = await axiosInstance.get("/reviews/", { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch reviews"
      );
    }
  }
);

/**
 * Create a new review.
 * POST /reviews/
 *
 * Backend enforces: one review per user per product; product must be active.
 *
 * @param {{ product_id: string, rating: number, title?: string, text: string }} reviewData
 * @returns {{ id, product_id, product_title, rating, title, text, user_email, user_name, helpful_count, created_at, updated_at }}
 */
export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/reviews/", reviewData);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data ||
          err.message ||
          "Failed to create review"
      );
    }
  }
);

/**
 * Update an existing review (partial).
 * PATCH /reviews/{id}/
 *
 * @param {{ id: string, ...updates }} payload
 * @returns {ReviewDetailSerializer}
 */
export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ id, ...updates }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch(`/reviews/${id}/`, updates);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.response?.data ||
          err.message ||
          "Failed to update review"
      );
    }
  }
);

/**
 * Delete a review.
 * DELETE /reviews/{id}/
 *
 * @param {string} id - Review UUID
 * @returns {string} The deleted review's id
 */
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/reviews/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to delete review"
      );
    }
  }
);

/**
 * Fetch aggregated review stats for a product.
 * GET /reviews/product_stats/?product_id={id}
 *
 * @param {string} productId
 * @returns {{ total_reviews, avg_rating, rating_distribution, recent_reviews, review_summary }}
 */
export const fetchProductStats = createAsyncThunk(
  "reviews/fetchProductStats",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/reviews/product_stats/", {
        params: { product_id: productId },
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to fetch product stats"
      );
    }
  }
);

/**
 * Search reviews by keyword.
 * GET /reviews/search/?q={query}&product_id={id}
 *
 * @param {{ query: string, productId?: string }} params
 * @returns {Array<ReviewListSerializer>}
 */
export const searchReviews = createAsyncThunk(
  "reviews/searchReviews",
  async ({ query, productId }, { rejectWithValue }) => {
    try {
      const params = { q: query };
      if (productId) params.product_id = productId;
      const { data } = await axiosInstance.get("/reviews/search/", { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to search reviews"
      );
    }
  }
);

/**
 * Ask an AI-powered question about product reviews.
 * GET /reviews/ask_question/?q={question}&product_id={id}
 *
 * Uses Groq LLM + pgvector cosine similarity over review embeddings.
 *
 * @param {{ question: string, productId?: string }} params
 * @returns {{ question, answer, supporting_reviews, products_analyzed, confidence: 'high'|'medium'|'low' }}
 */
export const askReviewQuestion = createAsyncThunk(
  "reviews/askReviewQuestion",
  async ({ question, productId }, { rejectWithValue }) => {
    try {
      const params = { q: question };
      if (productId) params.product_id = productId;
      const { data } = await axiosInstance.get("/reviews/ask_question/", {
        params,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail ||
          err.message ||
          "Failed to get AI answer"
      );
    }
  }
);
