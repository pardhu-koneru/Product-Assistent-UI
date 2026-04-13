/**
 * ChatInput — bottom input bar with image attach, textarea, and send button.
 */
export default function ChatInput({
  input,
  setInput,
  previews,
  onSend,
  onImageSelect,
  onRemoveImage,
  isLoading,
  fileInputRef,
  textareaRef,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-gray-200 bg-white px-3 sm:px-4 py-3">
      {/* Image previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
          {previews.map((src, idx) => (
            <div key={idx} className="relative shrink-0">
              <img
                src={src}
                alt={`upload-${idx}`}
                className="w-14 h-14 rounded-lg object-cover border border-gray-200"
              />
              <button
                onClick={() => onRemoveImage(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Image upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          title="Attach image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onImageSelect}
        />

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about products…"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 px-3 sm:px-4 py-2.5
                     text-sm text-gray-900 placeholder-gray-400 outline-none
                     focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                     max-h-[200px] leading-relaxed"
        />

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className="shrink-0 p-2.5 rounded-xl bg-indigo-600 text-white
                     hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors cursor-pointer"
          title="Send"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
        </button>
      </div>

      <p className="text-[11px] text-gray-400 text-center mt-2">
        ShopAI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
