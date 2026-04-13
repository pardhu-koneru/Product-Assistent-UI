const sizeClasses = {
  sm: "text-sm",
  md: "text-lg",
};

/**
 * StarRating — displays 1–5 stars based on a numeric rating.
 * Supports full, half, and empty stars.
 *
 * @param {{ rating: number, count?: number, size?: "sm" | "md" }} props
 */
export default function StarRating({ rating = 0, count, size = "md" }) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      // Full star
      stars.push(
        <span key={i} className="text-yellow-400">
          ★
        </span>
      );
    } else if (rating >= i - 0.5) {
      // Half star — lighter gold
      stars.push(
        <span key={i} className="text-yellow-300">
          ★
        </span>
      );
    } else {
      // Empty star
      stars.push(
        <span key={i} className="text-gray-300">
          ☆
        </span>
      );
    }
  }

  return (
    <div className={`flex items-center gap-0.5 ${sizeClasses[size]}`}>
      {stars}
      {count != null && (
        <span className="text-gray-400 text-sm ml-1">({count})</span>
      )}
    </div>
  );
}
