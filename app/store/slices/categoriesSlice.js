import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCategories,
  fetchCategoryBySlug,
  fetchSubcategories,
} from "~/store/thunks/categoriesThunks";

/**
 * Build a nested tree from a flat category array.
 * Categories with parent: null become root nodes.
 */
function buildCategoryTree(flatCategories) {
  const map = {};
  const roots = [];

  flatCategories.forEach((cat) => {
    map[cat.id] = { ...cat, children: [] };
  });

  flatCategories.forEach((cat) => {
    if (cat.parent && map[cat.parent]) {
      map[cat.parent].children.push(map[cat.id]);
    } else {
      roots.push(map[cat.id]);
    }
  });

  return roots;
}

/**
 * Categories state shape:
 * @property {Array}       items            – flat list of all active categories
 * @property {Array}       tree             – nested parent→children hierarchy (computed client-side)
 * @property {Object|null} selectedCategory – single category detail (fetched by slug)
 * @property {boolean}     loading
 * @property {string|null} error
 */
const initialState = {
  items: [],
  tree: [],
  selectedCategory: null,
  loading: false,
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearSelectedCategory(state) {
      state.selectedCategory = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchCategories ──────────────────────────────────────────
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.tree = buildCategoryTree(action.payload);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchCategoryBySlug ──────────────────────────────────────
    builder
      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchSubcategories ───────────────────────────────────────
    builder
      .addCase(fetchSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedCategory) {
          state.selectedCategory.children = action.payload;
        }
      })
      .addCase(fetchSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedCategory, clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
