import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "~/store/thunks/categoriesThunks";
import CategoryGrid from "~/components/categories/CategoryGrid";
import ErrorMessage from "~/components/common/ErrorMessage";

/**
 * CategoriesPage — lists all active categories with a live search filter.
 * GET /api/categories/
 */
export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.categories);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Client-side search filter (case-insensitive name match)
  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((cat) => cat.name.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

        <div className="relative w-full sm:w-72">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900
                       placeholder-gray-400 focus:ring-2 focus:ring-indigo-500
                       focus:border-indigo-500 outline-none transition-all duration-200"
          />
        </div>
      </div>

      {/* Error */}
      {error && <ErrorMessage message={error} />}

      {/* Grid */}
      <CategoryGrid
        categories={filtered}
        loading={loading}
        emptyMessage={search ? "No categories match your search" : "No categories available"}
      />
    </div>
  );
}
