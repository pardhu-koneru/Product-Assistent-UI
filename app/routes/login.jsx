import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import useAuth from "~/hooks/useAuth";
import Button from "~/components/common/Button";
import ErrorMessage from "~/components/common/ErrorMessage";

/**
 * LoginPage — centered card with email/password form.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading, error, login, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Clear stale errors on mount
  useEffect(() => {
    clearError();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect to home on successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-600 mt-1 mb-6">Sign in to your account</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                         placeholder-gray-400 focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500 outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                         placeholder-gray-400 focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500 outline-none transition-all duration-200"
              required
            />
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-4">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Register link */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
