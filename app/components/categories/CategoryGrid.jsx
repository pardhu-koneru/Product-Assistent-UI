import CategoryCard from "./CategoryCard";
import Spinner from "~/components/common/Spinner";
import EmptyState from "~/components/common/EmptyState";

/**
 * CategoryGrid — renders a responsive grid of CategoryCards.
 */
export default function CategoryGrid({
  categories,
  loading = false,
  emptyMessage = "No categories found",
}) {
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return <EmptyState title={emptyMessage} icon="🗂️" />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
}
