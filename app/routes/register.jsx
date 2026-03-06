import { useState, useEffect } from "react";
import { Link } from "react-router";
import useAuth from "~/hooks/useAuth";
import Button from "~/components/common/Button";
import ErrorMessage from "~/components/common/ErrorMessage";

/**
 * RegisterPage — centered card with registration form.
 * On success, shows verification email notice instead of navigating.
 */
export default function RegisterPage() {
  const { loading, error, emailVerificationSent, register, clearError } =
    useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState(null);

  // Clear stale errors on mount
  useEffect(() => {
    clearError();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);

    // Local validation
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    register({ email, password });
  };

  // Show success state after registration
  if (emailVerificationSent) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center">
          <span className="text-5xl">✉️</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            Account created!
          </h1>
          <p className="text-gray-600 mt-2">
            Please check your email to verify your account.
          </p>
          <Link
            to="/login"
            className="inline-block mt-6 text-indigo-600 font-medium hover:text-indigo-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
        <p className="text-gray-600 mt-1 mb-6">Join ShopAI today</p>

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
              placeholder="At least 8 characters"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                         placeholder-gray-400 focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500 outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                         placeholder-gray-400 focus:ring-2 focus:ring-indigo-500
                         focus:border-indigo-500 outline-none transition-all duration-200"
              required
            />
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        {/* Errors */}
        {(localError || error) && (
          <div className="mt-4">
            <ErrorMessage message={localError || error} />
          </div>
        )}

        {/* Login link */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:text-indigo-700"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
