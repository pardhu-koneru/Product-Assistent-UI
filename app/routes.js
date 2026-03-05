import { route, layout, index } from "@react-router/dev/routes";

export default [
  layout("layouts/PublicLayout.jsx", [
    index("routes/home.jsx"),
    route("categories", "routes/categories.jsx"),
    route("categories/:slug", "routes/category-detail.jsx"),
    route("products/:id", "routes/product-detail.jsx"),
    layout("routes/guards/guest.jsx", [
      route("login", "routes/login.jsx"),
      route("register", "routes/register.jsx"),
    ]),
    route("verify-email", "routes/verify-email.jsx"),
    route("*", "routes/not-found.jsx"),
  ]),
  route("chat", "routes/chat.jsx"),

  // ── Admin Dashboard (protected by admin guard) ──────────────────
  layout("routes/guards/admin.jsx", [
    route("admin", "layouts/AdminLayout.jsx", [
      index("routes/admin/dashboard.jsx"),
      route("users", "routes/admin/users.jsx"),
      route("products", "routes/admin/products.jsx"),
      route("categories", "routes/admin/categories.jsx"),
    ]),
  ]),
];
