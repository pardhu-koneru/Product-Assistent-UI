import { createSlice } from "@reduxjs/toolkit";
import {
  adminFetchUsers,
  adminFetchUserById,
  adminUpdateUser,
  adminDeleteUser,
  adminActivateUser,
  adminDeactivateUser,
  adminMakeStaff,
} from "~/store/thunks/adminUsersThunks";

/**
 * Admin users state shape:
 * @property {Array}       items        – paginated user list
 * @property {Object|null} selectedUser – single user detail
 * @property {Object}      pagination   – { count, next, previous, currentPage }
 * @property {boolean}     loading
 * @property {string|null} error
 */
const initialState = {
  items: [],
  selectedUser: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
  },
  loading: false,
  error: null,
};

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
    setPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── adminFetchUsers ──────────────────────────────────────────
    builder
      .addCase(adminFetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results;
        state.pagination.count = action.payload.count;
        state.pagination.next = action.payload.next;
        state.pagination.previous = action.payload.previous;
        state.pagination.currentPage = action.payload.currentPage;
      })
      .addCase(adminFetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminFetchUserById ───────────────────────────────────────
    builder
      .addCase(adminFetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminFetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(adminFetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminUpdateUser ──────────────────────────────────────────
    builder
      .addCase(adminUpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(adminUpdateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminDeleteUser ──────────────────────────────────────────
    builder
      .addCase(adminDeleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((u) => u.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(adminDeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminActivateUser ────────────────────────────────────────
    builder
      .addCase(adminActivateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminActivateUser.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.items[idx].is_active = true;
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser.is_active = true;
        }
      })
      .addCase(adminActivateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminDeactivateUser ──────────────────────────────────────
    builder
      .addCase(adminDeactivateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeactivateUser.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.items[idx].is_active = false;
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser.is_active = false;
        }
      })
      .addCase(adminDeactivateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ── adminMakeStaff ───────────────────────────────────────────
    builder
      .addCase(adminMakeStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminMakeStaff.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(
          (u) => u.email === action.payload.email
        );
        if (idx !== -1) {
          state.items[idx].is_staff = true;
          state.items[idx].role = "admin";
        }
      })
      .addCase(adminMakeStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedUser, setPage } =
  adminUsersSlice.actions;
export default adminUsersSlice.reducer;
