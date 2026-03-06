import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { fetchCategories } from "~/store/thunks/categoriesThunks";
import { fetchFeaturedProducts, fetchNewArrivals, searchProducts } from "~/store/thunks/productsThunks";
import { clearSearchResults } from "~/store/slices/productsSlice";
import useDebounce from "~/hooks/useDebounce";
import ProductGrid from "~/components/products/ProductGrid";
import CategorySection from "~/components/home/CategorySection";
import Spinner from "~/components/common/Spinner";
import ErrorMessage from "~/components/common/ErrorMessage";

/**
 * HomePage — hero with search, featured products, new arrivals, and browse by category.
 */
export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: categories, loading: catLoading } = useSelector((s) => s.categories);
  const { featured, newArrivals, searchResults, loading: prodLoading, error: prodError } = useSelector((s) => s.products);

  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchFeaturedProducts());
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      dispatch(searchProducts(debouncedQuery));
      setShowResults(true);
    } else {
      dispatch(clearSearchResults());
      setShowResults(false);
    }
  }, [debouncedQuery, dispatch]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductClick = (id) => {
    setShowResults(false);
    setQuery("");
    dispatch(clearSearchResults());
    navigate(`/products/${id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setShowResults(false);
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const resolveMediaUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
  };

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero + Search */}
      <section className="text-center py-8 sm:py-12 px-4">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">Welcome to ShopAI</h1>
        <p className="text-gray-500 mt-2 sm:mt-3 text-base sm:text-lg">Discover products curated for you</p>

        {/* Search Bar */}
        <div ref={searchRef} className="relative max-w-xl mx-auto mt-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0 && query.length >= 2) setShowResults(true); }}
              placeholder="Search for products, brands, categories..."
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-2xl text-sm sm:text-base shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow hover:shadow-md"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); dispatch(clearSearchResults()); setShowResults(false); }}
                className="absolute inset-y-0 right-12 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-500 hover:text-indigo-700 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-gray-200 shadow-xl max-h-96 overflow-y-auto">
              {prodLoading && searchResults.length === 0 ? (
                <div className="py-8 flex justify-center">
                  <Spinner size="sm" />
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-500">
                      {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{query}"
                    </p>
                  </div>
                  <ul>
                    {searchResults.slice(0, 8).map((product) => (
                      <li key={product.id}>
                        <button
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                        >
                          {product.primary_image ? (
                            <img
                              src={resolveMediaUrl(product.primary_image)}
                              alt={product.title}
                              className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.title}</p>
                            <p className="text-xs text-gray-500">
                              {product.currency || "USD"} {parseFloat(product.price).toFixed(2)}
                              {product.rating_avg ? ` · ${parseFloat(product.rating_avg).toFixed(1)}★` : ""}
                            </p>
                          </div>
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {searchResults.length > 8 && (
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full px-4 py-3 text-sm text-indigo-600 font-medium border-t border-gray-100 hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      View all {searchResults.length} results →
                    </button>
                  )}
                </div>
              ) : debouncedQuery.length >= 2 ? (
                <div className="px-4 py-8 text-center">
                  <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <p className="text-sm text-gray-500">No products found for "{query}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {prodError && <ErrorMessage message={prodError} />}

      {/* Featured */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Featured Products</h2>
        <ProductGrid products={featured} loading={prodLoading && !featured.length} emptyMessage="No featured products yet" />
      </section>

      {/* New Arrivals */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">New Arrivals</h2>
        <ProductGrid products={newArrivals} loading={prodLoading && !newArrivals.length} emptyMessage="No new arrivals yet" />
      </section>

      {/* Browse by Category */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Browse by Category</h2>
          <Link to="/categories" className="text-indigo-600 font-medium text-sm hover:text-indigo-700">View all →</Link>
        </div>
        {catLoading ? (
          <div className="py-8 flex justify-center"><Spinner size="md" /></div>
        ) : !categories.length ? (
          <p className="text-gray-500 text-center py-8">No categories available</p>
        ) : (
          <div className="space-y-10">
            {categories.map((cat) => <CategorySection key={cat.id} category={cat} />)}
          </div>
        )}
      </section>
    </div>
  );
}
