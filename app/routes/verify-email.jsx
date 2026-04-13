import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import useAuth from "~/hooks/useAuth";
import Spinner from "~/components/common/Spinner";
import ErrorMessage from "~/components/common/ErrorMessage";
import Button from "~/components/common/Button";

/**
 * VerifyEmailPage — auto-verifies email from ?token= query param.
 *
 * NOTE: The backend verify_email endpoint requires authentication (IsAuthenticated),
 * so the user must be logged in for verification to succeed. If they are not logged in,
 * we show a prompt to log in first.
 */
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loading, error, verifyEmail, resendVerification, clearError, user } =
    useAuth();

  const token = searchParams.get("token");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    clearError();

    if (token) {
      verifyEmail({ token })
        .unwrap()
        .then(() => setVerified(true))
        .catch(() => {}); // error is captured in Redux state
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // No token in URL
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center">
          <span className="text-5xl text-red-500">✗</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4">
            Invalid verification link
          </h2>
          <p className="text-gray-600 mt-2">No token found.</p>
          <Button className="mt-6" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-4">Verifying your email...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (verified) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center">
          <span className="text-5xl text-green-500">✓</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4">
            Email verified successfully!
          </h2>
          <p className="text-gray-600 mt-2">Your account is now active.</p>
          <Button className="mt-6" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-8 text-center">
        <span className="text-5xl text-red-500">✗</span>
        <h2 className="text-xl font-bold text-gray-900 mt-4">
          Verification failed
        </h2>
        {error && (
          <div className="mt-4">
            <ErrorMessage message={error} />
          </div>
        )}
        {user?.email && (
          <Button
            className="mt-6"
            variant="secondary"
            onClick={() => resendVerification({ email: user.email })}
          >
            Resend Verification Email
          </Button>
        )}
        <Button
          className="mt-3"
          variant="ghost"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </div>
    </div>
  );
}
