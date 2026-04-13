import StarRating from "~/components/common/StarRating";

/**
 * ReviewCard — single review display.
 */
export default function ReviewCard({ review }) {
  const date = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <StarRating rating={review.rating} size="sm" />
          {review.title && (
            <span className="font-semibold text-gray-900 text-sm">
              {review.title}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>

      <p className="text-xs text-gray-400">
        by {review.user_email}
        {review.helpful_count > 0 && (
          <span className="ml-3">
            👍 {review.helpful_count} found this helpful
          </span>
        )}
      </p>
    </div>
  );
}
