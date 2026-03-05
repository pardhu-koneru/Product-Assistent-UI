/**
 * EmptyState — centered placeholder for empty lists/results.
 */
export default function EmptyState({
  title,
  description,
  icon = "📭",
  action,
}) {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      {description && <p className="text-gray-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
