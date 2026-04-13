import { useEffect } from "react";
import { useParams, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { resolveMediaUrl } from "~/services/mediaUrl";
import { fetchCategoryBySlug } from "~/store/thunks/categoriesThunks";
import { fetchProductsByCategory } from "~/store/thunks/productsThunks";
import ProductGrid from "~/components/products/ProductGrid";
import CategoryGrid from "~/components/categories/CategoryGrid";
import ErrorMessage from "~/components/common/ErrorMessage";
import Spinner from "~/components/common/Spinner";

/**
 * CategoryDetailPage — shows a single category with its subcategories and products.
 * GET /api/categories/{slug}/
 * GET /api/products/by_category/?slug={slug}
 */
export default function CategoryDetailPage() {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { selectedCategory, loading: catLoading, error: catError } =
    useSelector((state) => state.categories);
  const { items: products, loading: prodLoading, error: prodError } =
    useSelector((state) => state.products);

  useEffect(() => {
    if (slug) {
      dispatch(fetchCategoryBySlug(slug));
      dispatch(fetchProductsByCategory(slug));
    }
  }, [slug, dispatch]);

  if (catLoading && !selectedCategory) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (catError) {
    return <ErrorMessage message={catError} />;
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-indigo-600">
          Home
        </Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-indigo-600">
          Categories
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">
          {selectedCategory?.name}
        </span>
      </nav>

      {/* Category header */}
      <div className="flex items-center gap-4 sm:gap-6">
        {selectedCategory?.image && (
          <img
            src={resolveMediaUrl(selectedCategory.image)}
            alt={selectedCategory.name}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg object-cover"
          />
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {selectedCategory?.name}
          </h1>
          {selectedCategory?.description && (
            <p className="text-gray-600 mt-1">{selectedCategory.description}</p>
          )}
        </div>
      </div>

      {/* Subcategories */}
      {selectedCategory?.children?.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Subcategories
          </h2>
          <CategoryGrid categories={selectedCategory.children} />
        </section>
      )}

      {/* Products in this category */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
        {prodError && <ErrorMessage message={prodError} />}
        <ProductGrid
          products={products}
          loading={prodLoading}
          emptyMessage="No products in this category"
        />
      </section>
    </div>
  );
}
