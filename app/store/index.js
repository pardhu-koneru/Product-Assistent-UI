import { configureStore } from "@reduxjs/toolkit";

import authReducer from "~/store/slices/authSlice";
import categoriesReducer from "~/store/slices/categoriesSlice";
import productsReducer from "~/store/slices/productsSlice";
import adminProductsReducer from "~/store/slices/adminProductsSlice";
import reviewsReducer from "~/store/slices/reviewsSlice";
import adminUsersReducer from "~/store/slices/adminUsersSlice";
import adminCategoriesReducer from "~/store/slices/adminCategoriesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesReducer,
    products: productsReducer,
    adminProducts: adminProductsReducer,
    reviews: reviewsReducer,
    adminUsers: adminUsersReducer,
    adminCategories: adminCategoriesReducer,
  },
});

export default store;
