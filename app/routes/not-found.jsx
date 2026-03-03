import { Link } from "react-router";

/**
 * NotFoundPage — 404 fallback route.
 */
export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <Link
        to="/"
        className="inline-block mt-6 text-indigo-600 font-medium hover:text-indigo-700"
      >
        Go back home
      </Link>
    </div>
  );
}
