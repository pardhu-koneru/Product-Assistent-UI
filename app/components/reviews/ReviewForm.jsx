import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "~/store/thunks/reviewsThunks";
import Button from "~/components/common/Button";
import ErrorMessage from "~/components/common/ErrorMessage";

/**
 * ReviewForm — allows authenticated users to submit a product review.
 */
export default function ReviewForm({ productId }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.reviews);

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!text.trim()) {
      setLocalError("Review text is required");
      return;
    }

    dispatch(
      createReview({
        product_id: productId,
        rating,
        title: title.trim() || undefined,
        text: text.trim(),
      })
    )
      .unwrap()
      .then(() => {
        setSubmitted(true);
        setTitle("");
        setText("");
        setRating(5);
      })
      .catch((err) => {
        const msg =
          typeof err === "string"
            ? err
            : err?.detail ||
              err?.non_field_errors?.[0] ||
              "Failed to submit review";
        setLocalError(msg);
      });
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-sm">
        Thank you for your review!
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 space-y-4"
    >
      <h3 className="font-semibold text-gray-900">Write a Review</h3>

      {/* Rating picker */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-2xl cursor-pointer transition-colors"
            >
              <span
                className={
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }
              >
                ★
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review title (optional)"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                   placeholder-gray-400 focus:ring-2 focus:ring-indigo-500
                   focus:border-indigo-500 outline-none text-sm"
      />

      {/* Text */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900
                   placeholder-gray-400 focus:ring-2 focus:ring-indigo-500
                   focus:border-indigo-500 outline-none text-sm resize-none"
        required
      />

      {localError && <ErrorMessage message={localError} />}

      <Button type="submit" loading={loading}>
        Submit Review
      </Button>
    </form>
  );
}
