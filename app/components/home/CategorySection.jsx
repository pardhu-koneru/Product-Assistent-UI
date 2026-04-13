import { useEffect, useState } from "react";
import { Link } from "react-router";
import axiosInstance from "~/services/axiosInstance";
import ProductGrid from "~/components/products/ProductGrid";
import Spinner from "~/components/common/Spinner";

/**
 * CategorySection — fetches and displays products for a single category.
 */
export default function CategorySection({ category }) {
  const { slug, name } = category;
  const { items, loading } = useCategoryProducts(slug);

  // Don't render if the category has no products and we finished loading
  if (!loading && items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          {name}
        </h3>
        <Link
          to={`/categories/${slug}`}
          className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
        >
          See all →
        </Link>
      </div>
      {loading ? (
        <div className="py-6 flex justify-center">
          <Spinner size="md" />
        </div>
      ) : (
        <ProductGrid products={items.slice(0, 5)} />
      )}
    </div>
  );
}

/**
 * Custom hook: fetch products for a specific category slug.
 * Uses direct axios call to avoid clobbering the global products.items state.
 */
function useCategoryProducts(slug) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    axiosInstance
      .get("/products/by_category/", { params: { slug } })
      .then(({ data }) => {
        if (!cancelled)
          setItems(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { items, loading };
}
