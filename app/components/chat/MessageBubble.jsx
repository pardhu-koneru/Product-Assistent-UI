import TypingDots from "./TypingDots";
import FormattedAnswer from "./FormattedAnswer";
import ProductResultCards from "./ProductResultCards";

/**
 * MessageBubble — renders a single user or assistant message.
 * For assistant messages, also renders product cards if available.
 */
export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[90%] sm:max-w-[85%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-indigo-600 text-white rounded-br-md"
            : message.isError
            ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-md"
            : "bg-gray-100 text-gray-900 rounded-bl-md"
        }`}
      >
        {message.streaming && message.content === "" ? (
          <TypingDots />
        ) : (
          <>
            <FormattedAnswer text={message.content} />
            {!isUser && !message.streaming && message.products?.length > 0 && (
              <ProductResultCards products={message.products} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
