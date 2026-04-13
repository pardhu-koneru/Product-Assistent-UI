import { createSlice } from "@reduxjs/toolkit";
import {
  adminFetchCategories,
  adminFetchCategoryBySlug,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminDeactivateCategory,
  adminActivateCategory,
  adminFetchCategoryStats,
  adminFetchCategoryTree,
} from "~/store/thunks/adminCategoriesThunks";

/**
 * Admin categories state shape:
 * @property {Array}       items            – flat category list
 * @property {Object|null} selectedCategory – single category detail
 * @property {Array}       tree             – nested category tree
 * @property {Object|null} stats            – category statistics
 * @property {boolean}     loading
 * @property {string|null} error
 */
const initialState = {
  items: [],
  selectedCategory: null,
  tree: [],
  stats: null,
  loading: false,
  error: null,
};

const adminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSelectedCategory(state) {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    // ── adminFetchCategories ─────────────────────────────────────
    builder
      .addCase(adminFetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(adminFetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminFetchCategoryBySlug ─────────────────────────────────
    builder
      .addCase(adminFetchCategoryBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchCategoryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(adminFetchCategoryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminCreateCategory ──────────────────────────────────────
    builder
      .addCase(adminCreateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminCreateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(adminCreateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminUpdateCategory ──────────────────────────────────────
    builder
      .addCase(adminUpdateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminUpdateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(
          (c) => c.slug === action.payload.slug
        );
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedCategory?.slug === action.payload.slug) {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(adminUpdateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminDeleteCategory ──────────────────────────────────────
    builder
      .addCase(adminDeleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((c) => c.slug !== action.payload);
        if (state.selectedCategory?.slug === action.payload) {
          state.selectedCategory = null;
        }
      })
      .addCase(adminDeleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminDeactivateCategory ──────────────────────────────────
    builder
      .addCase(adminDeactivateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeactivateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        const idx = state.items.findIndex((c) => c.slug === updated.slug);
        if (idx !== -1) state.items[idx] = updated;
        if (state.selectedCategory?.slug === updated.slug) {
          state.selectedCategory = updated;
        }
      })
      .addCase(adminDeactivateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminActivateCategory ────────────────────────────────────
    builder
      .addCase(adminActivateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminActivateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data;
        const idx = state.items.findIndex((c) => c.slug === updated.slug);
        if (idx !== -1) state.items[idx] = updated;
        if (state.selectedCategory?.slug === updated.slug) {
          state.selectedCategory = updated;
        }
      })
      .addCase(adminActivateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminFetchCategoryStats ──────────────────────────────────
    builder
      .addCase(adminFetchCategoryStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchCategoryStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(adminFetchCategoryStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminFetchCategoryTree ───────────────────────────────────
    builder
      .addCase(adminFetchCategoryTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchCategoryTree.fulfilled, (state, action) => {
        state.loading = false;
        state.tree = action.payload;
      })
      .addCase(adminFetchCategoryTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedCategory } =
  adminCategoriesSlice.actions;
export default adminCategoriesSlice.reducer;
