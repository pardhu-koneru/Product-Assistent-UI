/**
 * ErrorMessage — red-tinted alert box for error display.
 * @param {{ message: string | null }} props
 */
export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700">
      <span className="text-red-500 mt-0.5 shrink-0">⚠</span>
      <p className="text-sm">{message}</p>
    </div>
  );
}
