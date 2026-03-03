import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "~/store/thunks/authThunks";
import Spinner from "./Spinner";
import Button from "./Button";

/**
 * Navbar — responsive top navigation bar with mobile hamburger menu.
 */
export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, loading } = useSelector(
    (state) => state.auth
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    setMobileOpen(false);
    dispatch(logoutUser());
  };

  const closeMobile = () => setMobileOpen(false);

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "font-semibold text-indigo-600 md:border-b-2 md:border-indigo-600"
        : "text-gray-600 hover:text-indigo-600"
    }`;

  return (
    <nav className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <NavLink
            to="/"
            onClick={closeMobile}
            className="text-lg sm:text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            ShopAI
          </NavLink>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/categories" className={linkClass}>Categories</NavLink>
            <NavLink to="/chat" className={linkClass}>Chat</NavLink>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <Spinner size="sm" />
            ) : !isAuthenticated ? (
              <>
                <NavLink to="/login" className={linkClass}>Login</NavLink>
                <Button variant="primary" onClick={() => navigate("/register")} className="text-sm">
                  Register
                </Button>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-500 truncate max-w-[160px]">{user?.email}</span>
                {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
                <Button variant="ghost" onClick={handleLogout} className="text-sm">Logout</Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg">
          <div className="container mx-auto px-4 py-3 space-y-1">
            <NavLink to="/" className={linkClass} onClick={closeMobile}>Home</NavLink>
            <NavLink to="/categories" className={linkClass} onClick={closeMobile}>Categories</NavLink>
            <NavLink to="/chat" className={linkClass} onClick={closeMobile}>Chat</NavLink>

            <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
              {loading ? (
                <div className="py-2"><Spinner size="sm" /></div>
              ) : !isAuthenticated ? (
                <>
                  <NavLink to="/login" className={linkClass} onClick={closeMobile}>Login</NavLink>
                  <NavLink to="/register" className={linkClass} onClick={closeMobile}>Register</NavLink>
                </>
              ) : (
                <>
                  <p className="px-3 py-1 text-xs text-gray-400 truncate">{user?.email}</p>
                  {isAdmin && <NavLink to="/admin" className={linkClass} onClick={closeMobile}>Admin Dashboard</NavLink>}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
