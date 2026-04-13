import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Spinner from "~/components/common/Spinner";

/**
 * AdminRoute — blocks non-admin users from accessing admin pages.
 * If loading → show spinner
 * If not authenticated → redirect to /login
 * If authenticated but not admin → redirect to /
 * If admin → render child routes
 */
export default function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useSelector(
    (state) => state.auth
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
