/**
 * WelcomeScreen — shown when chat has no messages yet.
 * @param {{ onSuggestionClick?: (text: string) => void }} props
 */
export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16 sm:py-20 space-y-3 px-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">
        🛒
      </div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        ShopAI Assistant
      </h2>
      <p className="text-sm text-gray-500 max-w-sm">
        Ask me anything about our products — search by name, category, price
        range, specifications, or get recommendations.
      </p>
      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {[
          "Show laptops under ₹1,00,000",
          "Best rated smartphones",
          "Compare Dell vs HP laptops",
        ].map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onSuggestionClick?.(q)}
            className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs
                       hover:bg-indigo-100 hover:text-indigo-700 transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
