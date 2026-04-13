import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "~/services/axiosInstance";
import WelcomeScreen from "~/components/chat/WelcomeScreen";
import MessageBubble from "~/components/chat/MessageBubble";
import ChatInput from "~/components/chat/ChatInput";

/**
 * ChatPage — ChatGPT-style interface for RAG queries.
 * Full-screen layout (no header/footer from PublicLayout).
 */
export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  /* auto-scroll */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  /* auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 200) + "px";
    }
  }, [input]);

  /* image handling */
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((prev) => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  /* send message */
  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setImages([]);
    setPreviews([]);
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "", streaming: true }]);

    try {
      const res = await axiosInstance.post("/rag-query/", { query: text });
      const answer = res.data?.answer || "Sorry, I couldn't find an answer.";
      const products = res.data?.products || [];
      await streamAnswer(answer, products);
    } catch (err) {
      const errMsg = err?.response?.data?.detail || err?.response?.data?.error || "Something went wrong.";
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "assistant", content: errMsg, isError: true, streaming: false };
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* letter-by-letter streaming */
  const streamAnswer = (text, products = []) =>
    new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        i += 2;
        const done = i >= text.length;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: text.slice(0, i),
            streaming: !done,
            ...(done && products.length > 0 ? { products } : {}),
          };
          return copy;
        });
        if (done) { clearInterval(interval); resolve(); }
      }, 12);
    });

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top bar with home button */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          Home
        </button>
        <h1 className="text-sm font-semibold text-gray-900">ShopAI Assistant</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {messages.length === 0 && <WelcomeScreen onSuggestionClick={(text) => setInput(text)} />}
          {messages.map((msg, idx) => <MessageBubble key={idx} message={msg} />)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto w-full">
        <ChatInput
          input={input}
          setInput={setInput}
          previews={previews}
          onSend={handleSend}
          onImageSelect={handleImageSelect}
          onRemoveImage={removeImage}
          isLoading={isLoading}
          fileInputRef={fileInputRef}
          textareaRef={textareaRef}
        />
      </div>
    </div>
  );
}
