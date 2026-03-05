const variantStyles = {
  success: "bg-green-100 text-green-800",
  danger: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
  neutral: "bg-gray-100 text-gray-800",
};

/**
 * Badge — small inline pill for status labels.
 */
export default function Badge({ label, variant = "neutral" }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant] || variantStyles.neutral}`}
    >
      {label}
    </span>
  );
}
