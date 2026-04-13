import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Spinner from "~/components/common/Spinner";

/**
 * ProtectedRoute — blocks unauthenticated users from accessing private pages.
 * If loading → show spinner (covers re-hydration on boot)
 * If not authenticated → redirect to /login
 * If authenticated → render child routes
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

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

  return <Outlet />;
}
