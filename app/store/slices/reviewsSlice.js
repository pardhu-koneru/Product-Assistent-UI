import { createSlice } from "@reduxjs/toolkit";
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
  fetchProductStats,
  searchReviews,
  askReviewQuestion,
} from "~/store/thunks/reviewsThunks";

/**
 * Reviews state shape:
 * @property {Array}       items           – reviews for the current product
 * @property {Object|null} productStats    – { total_reviews, avg_rating, rating_distribution, recent_reviews, review_summary }
 * @property {Array}       searchResults   – review search results
 * @property {Object|null} aiAnswer        – { question, answer, supporting_reviews, products_analyzed, confidence }
 * @property {boolean}     userHasReviewed – whether the current user reviewed this product
 * @property {boolean}     loading
 * @property {boolean}     aiLoading       – separate loader for AI Q&A
 * @property {string|null} error
 */
const initialState = {
  items: [],
  productStats: null,
  searchResults: [],
  aiAnswer: null,
  userHasReviewed: false,
  loading: false,
  aiLoading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    /** Reset AI answer to null */
    clearAiAnswer(state) {
      state.aiAnswer = null;
    },
    /** Reset items when navigating away from product */
    clearReviews(state) {
      state.items = [];
      state.productStats = null;
      state.searchResults = [];
      state.aiAnswer = null;
      state.userHasReviewed = false;
      state.error = null;
    },
    /** Clear error */
    clearError(state) {
      state.error = null;
    },
    /**
     * Manually set userHasReviewed.
     * Components call this after comparing auth.user.email against review user_emails.
     */
    setUserHasReviewed(state, action) {
      state.userHasReviewed = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── fetchReviews ─────────────────────────────────────────────
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── createReview ─────────────────────────────────────────────
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.userHasReviewed = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── updateReview ─────────────────────────────────────────────
    builder
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── deleteReview ─────────────────────────────────────────────
    builder
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((r) => r.id !== action.payload);
        state.userHasReviewed = false;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchProductStats ────────────────────────────────────────
    builder
      .addCase(fetchProductStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.loading = false;
        state.productStats = action.payload;
      })
      .addCase(fetchProductStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── searchReviews ────────────────────────────────────────────
    builder
      .addCase(searchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── askReviewQuestion ────────────────────────────────────────
    builder
      .addCase(askReviewQuestion.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
      })
      .addCase(askReviewQuestion.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiAnswer = action.payload;
      })
      .addCase(askReviewQuestion.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAiAnswer, clearReviews, clearError, setUserHasReviewed } =
  reviewsSlice.actions;
export default reviewsSlice.reducer;
