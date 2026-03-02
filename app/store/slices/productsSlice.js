import { createSlice } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductById,
  fetchProductsByCategory,
  searchProducts,
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchRecommendations,
  fetchProductAttributes,
} from "~/store/thunks/productsThunks";

const defaultFilters = {
  category: null,
  priceMin: null,
  priceMax: null,
  brand: null,
  inStock: null,
  rating: null,
  search: "",
};

/**
 * Public products state shape:
 * @property {Array}       items           – product list (ProductListSerializer)
 * @property {Object|null} selectedProduct – product detail (ProductDetailSerializer)
 * @property {Array}       featured        – top-rated in-stock products
 * @property {Array}       newArrivals     – newest products
 * @property {Array}       recommendations – high-rating-count products
 * @property {Array}       searchResults   – search results
 * @property {Object}      filters         – active filter values
 * @property {Object}      pagination      – { count, next, previous, currentPage }
 * @property {boolean}     loading
 * @property {string|null} error
 */
const initialState = {
  items: [],
  selectedProduct: null,
  featured: [],
  newArrivals: [],
  recommendations: [],
  searchResults: [],
  filters: { ...defaultFilters },
  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  },
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    /** Merge partial filter updates */
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    /** Reset all filters to defaults */
    clearFilters(state) {
      state.filters = { ...defaultFilters };
      state.pagination.currentPage = 1;
    },
    /** Set current page number */
    setPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    /** Clear selected product (on navigate away) */
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    /** Clear search results */
    clearSearchResults(state) {
      state.searchResults = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchProducts ────────────────────────────────────────────
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchProductById ─────────────────────────────────────────
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchProductsByCategory ──────────────────────────────────
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── searchProducts ───────────────────────────────────────────
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchFeaturedProducts ────────────────────────────────────
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchNewArrivals ─────────────────────────────────────────
    builder
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchRecommendations ─────────────────────────────────────
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── fetchProductAttributes ───────────────────────────────────
    builder
      .addCase(fetchProductAttributes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductAttributes.fulfilled, (state, action) => {
        state.loading = false;
        if (
          state.selectedProduct &&
          state.selectedProduct.id === action.payload.product_id
        ) {
          state.selectedProduct.attributes = action.payload.attributes;
        }
      })
      .addCase(fetchProductAttributes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPage,
  clearSelectedProduct,
  clearSearchResults,
  clearError,
} = productsSlice.actions;
export default productsSlice.reducer;
