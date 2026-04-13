import { createSlice } from "@reduxjs/toolkit";
import {
  adminFetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminAddAttributes,
  adminUploadImage,
  adminToggleActive,
  adminFetchStats,
  adminProcessAI,
  adminPollAIStatus,
  adminBatchProcessAI,
  adminPollBatchStatus,
} from "~/store/thunks/adminProductsThunks";

/**
 * Admin products state shape:
 * @property {Array}       items           – admin product list (all, including inactive)
 * @property {Object|null} selectedProduct – single product detail
 * @property {Object|null} stats           – { total_products, active_products, in_stock_products, products_with_ratings }
 * @property {string|null} aiTaskId        – Celery task ID for single AI processing
 * @property {string|null} aiTaskStatus    – 'PENDING' | 'SUCCESS' | 'FAILURE'
 * @property {string|null} aiTaskResult    – result/message from AI processing
 * @property {string|null} batchTaskId     – Celery task ID for batch AI processing
 * @property {string|null} batchTaskStatus – 'PENDING' | 'SUCCESS' | 'FAILURE'
 * @property {boolean}     loading
 * @property {string|null} error
 */
const initialState = {
  items: [],
  selectedProduct: null,
  stats: null,
  aiTaskId: null,
  aiTaskStatus: null,
  aiTaskResult: null,
  batchTaskId: null,
  batchTaskStatus: null,
  loading: false,
  error: null,
};

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearAIState(state) {
      state.aiTaskId = null;
      state.aiTaskStatus = null;
      state.aiTaskResult = null;
    },
    clearBatchState(state) {
      state.batchTaskId = null;
      state.batchTaskStatus = null;
    },
  },
  extraReducers: (builder) => {
    // ── adminFetchProducts ───────────────────────────────────────
    builder
      .addCase(adminFetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(adminFetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminCreateProduct ───────────────────────────────────────
    builder
      .addCase(adminCreateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminCreateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(adminCreateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminUpdateProduct ───────────────────────────────────────
    builder
      .addCase(adminUpdateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedProduct?.id === action.payload.id) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(adminUpdateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminDeleteProduct ───────────────────────────────────────
    builder
      .addCase(adminDeleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(adminDeleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminAddAttributes ───────────────────────────────────────
    builder
      .addCase(adminAddAttributes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminAddAttributes.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(adminAddAttributes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminUploadImage ─────────────────────────────────────────
    builder
      .addCase(adminUploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminUploadImage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(adminUploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminToggleActive ────────────────────────────────────────
    builder
      .addCase(adminToggleActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminToggleActive.fulfilled, (state, action) => {
        state.loading = false;
        const { id, is_active } = action.payload;
        const idx = state.items.findIndex((p) => p.id === id);
        if (idx !== -1) state.items[idx].is_active = is_active;
        if (state.selectedProduct?.id === id) {
          state.selectedProduct.is_active = is_active;
        }
      })
      .addCase(adminToggleActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminFetchStats ──────────────────────────────────────────
    builder
      .addCase(adminFetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(adminFetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminProcessAI ───────────────────────────────────────────
    builder
      .addCase(adminProcessAI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.aiTaskStatus = null;
        state.aiTaskResult = null;
      })
      .addCase(adminProcessAI.fulfilled, (state, action) => {
        state.loading = false;
        state.aiTaskId = action.payload.task_id;
        state.aiTaskStatus = "PENDING";
      })
      .addCase(adminProcessAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminPollAIStatus ────────────────────────────────────────
    builder
      .addCase(adminPollAIStatus.fulfilled, (state, action) => {
        const { status, message, result } = action.payload;
        if (status === "completed") {
          state.aiTaskStatus = "SUCCESS";
          state.aiTaskResult = result || message;
        } else if (status === "failed") {
          state.aiTaskStatus = "FAILURE";
          state.aiTaskResult = message;
        } else {
          state.aiTaskStatus = "PENDING";
        }
      })
      .addCase(adminPollAIStatus.rejected, (state, action) => {
        state.aiTaskStatus = "FAILURE";
        state.error = action.payload;
      });

    // ── adminBatchProcessAI ──────────────────────────────────────
    builder
      .addCase(adminBatchProcessAI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.batchTaskStatus = null;
      })
      .addCase(adminBatchProcessAI.fulfilled, (state, action) => {
        state.loading = false;
        state.batchTaskId = action.payload.task_id;
        state.batchTaskStatus = "PENDING";
      })
      .addCase(adminBatchProcessAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminPollBatchStatus ─────────────────────────────────────
    builder
      .addCase(adminPollBatchStatus.fulfilled, (state, action) => {
        const { status } = action.payload;
        if (status === "completed") {
          state.batchTaskStatus = "SUCCESS";
        } else if (status === "failed") {
          state.batchTaskStatus = "FAILURE";
        } else {
          state.batchTaskStatus = "PENDING";
        }
      })
      .addCase(adminPollBatchStatus.rejected, (state, action) => {
        state.batchTaskStatus = "FAILURE";
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedProduct, clearAIState, clearBatchState } =
  adminProductsSlice.actions;
export default adminProductsSlice.reducer;
