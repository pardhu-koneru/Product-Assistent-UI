import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import Spinner from "~/components/common/Spinner";

/**
 * GuestRoute — prevents already-logged-in users from seeing login/register pages.
 * If authenticated → redirect to /
 * If not authenticated → render child routes
 */
export default function GuestRoute() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
