import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchCurrentUser,
  verifyEmail,
  resendVerificationEmail,
} from "~/store/thunks/authThunks";
import { clearError } from "~/store/slices/authSlice";

/**
 * useAuth — single hook that any auth-related component uses.
 * Abstracts useSelector and useDispatch calls away from pages.
 */
export default function useAuth() {
  const dispatch = useDispatch();
  const {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    emailVerificationSent,
  } = useSelector((state) => state.auth);

  return {
    // State from Redux
    user,
    isAuthenticated,
    isAdmin,
    loading,
    error,
    emailVerificationSent,

    // Bound action dispatchers
    login: (payload) => dispatch(loginUser(payload)),
    register: (payload) => dispatch(registerUser(payload)),
    logout: () => dispatch(logoutUser()),
    fetchCurrentUser: () => dispatch(fetchCurrentUser()),
    verifyEmail: (payload) => dispatch(verifyEmail(payload)),
    resendVerification: (payload) => dispatch(resendVerificationEmail(payload)),
    clearError: () => dispatch(clearError()),
  };
}
