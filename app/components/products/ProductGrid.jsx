import ProductCard from "./ProductCard";
import Spinner from "~/components/common/Spinner";
import EmptyState from "~/components/common/EmptyState";

/**
 * ProductGrid — renders a responsive grid of ProductCards.
 *
 * @param {{ products: Array, loading?: boolean, emptyMessage?: string }} props
 */
export default function ProductGrid({
  products,
  loading = false,
  emptyMessage = "No products found",
}) {
  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState title={emptyMessage} icon="📦" />;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
