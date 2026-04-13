import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  adminFetchCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminDeactivateCategory,
  adminActivateCategory,
  adminFetchCategoryStats,
  adminFetchCategoryTree,
} from "~/store/thunks/adminCategoriesThunks";
import { clearError } from "~/store/slices/adminCategoriesSlice";
import useDebounce from "~/hooks/useDebounce";
import Spinner from "~/components/common/Spinner";
import ErrorMessage from "~/components/common/ErrorMessage";
import Badge from "~/components/common/Badge";
import Button from "~/components/common/Button";
import Modal from "~/components/common/Modal";
import { resolveMediaUrl } from "~/services/mediaUrl";

/* ================================================================== */
/*  Create / Edit Category Modal                                       */
/* ================================================================== */
function CategoryFormModal({ isOpen, onClose, category, allCategories, loading }) {
  const dispatch = useDispatch();
  const isEdit = !!category;
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (category) {
      reset({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        parent: category.parent || "",
        is_active: category.is_active ?? true,
      });
      setPreview(category.image ? resolveMediaUrl(category.image) : null);
    } else {
      reset({ name: "", slug: "", description: "", parent: "", is_active: true });
      setPreview(null);
    }
    setImageFile(null);
  }, [category, reset, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    // Build FormData if we have an image, otherwise JSON
    if (imageFile) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      if (data.description) formData.append("description", data.description);
      if (data.parent) formData.append("parent", data.parent);
      formData.append("is_active", data.is_active === true || data.is_active === "true");
      formData.append("image", imageFile);

      if (isEdit) {
        await dispatch(adminUpdateCategory({ slug: category.slug, formData }));
      } else {
        await dispatch(adminCreateCategory(formData));
      }
    } else {
      const payload = {
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        parent: data.parent || null,
        is_active: data.is_active === true || data.is_active === "true",
      };

      if (isEdit) {
        await dispatch(adminUpdateCategory({ slug: category.slug, ...payload }));
      } else {
        await dispatch(adminCreateCategory(payload));
      }
    }
    onClose();
  };

  // Filter out current category and its children from parent options
  const parentOptions = allCategories.filter(
    (c) => !isEdit || (c.slug !== category?.slug)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Category" : "Create Category"} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              {...register("slug", { required: "Slug is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="e.g. electronics-phones"
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
            <select
              {...register("parent")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white cursor-pointer"
            >
              <option value="">None (root category)</option>
              {parentOptions.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              {...register("is_active")}
              type="checkbox"
              id="cat_is_active"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="cat_is_active" className="text-sm text-gray-700 cursor-pointer">Active</label>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer"
            />
            {preview && (
              <img src={preview} alt="Preview" className="mt-2 w-full max-h-32 object-contain rounded-lg border border-gray-200" />
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>{isEdit ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ================================================================== */
/*  Confirm Delete Modal                                               */
/* ================================================================== */
function ConfirmDeleteModal({ isOpen, onClose, category, loading, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Category" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold">{category?.name}</span>?
          Categories with children cannot be deleted.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="danger" loading={loading} onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </Modal>
  );
}

/* ================================================================== */
/*  Category Tree Node                                                 */
/* ================================================================== */
function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children?.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors ${depth > 0 ? "ml-6" : ""}`}
      >
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-0.5 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <svg className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ) : (
          <span className="w-5" />
        )}
        <span className="text-sm text-gray-800">{node.name}</span>
        <Badge
          label={node.is_active ? "Active" : "Inactive"}
          variant={node.is_active ? "success" : "danger"}
        />
        {node.product_count !== undefined && (
          <span className="text-xs text-gray-400 ml-auto">{node.product_count} products</span>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id || child.slug} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Admin Categories Page                                              */
/* ================================================================== */
export default function AdminCategories() {
  const dispatch = useDispatch();
  const { items, tree, stats, loading, error } = useSelector((s) => s.adminCategories);

  const [view, setView] = useState("list"); // "list" | "tree"
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [ordering, setOrdering] = useState("name");
  const [formCategory, setFormCategory] = useState(undefined); // undefined=closed, null=create, object=edit
  const [deleteCategory, setDeleteCategory] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const params = {};
    if (filterActive !== "") params.isActive = filterActive === "true";
    if (debouncedSearch) params.search = debouncedSearch;
    if (ordering) params.ordering = ordering;
    dispatch(adminFetchCategories(params));
    dispatch(adminFetchCategoryStats());
    dispatch(adminFetchCategoryTree());
  }, [dispatch, filterActive, debouncedSearch, ordering]);

  const hasActiveFilters = search || filterActive;

  const handleClearFilters = () => {
    setSearch("");
    setFilterActive("");
    setOrdering("name");
  };

  const handleToggleActive = (cat) => {
    if (cat.is_active) {
      dispatch(adminDeactivateCategory(cat.slug));
    } else {
      dispatch(adminActivateCategory(cat.slug));
    }
  };

  const handleDelete = async () => {
    await dispatch(adminDeleteCategory(deleteCategory.slug));
    setDeleteCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-500 mt-1">
            {stats
              ? `${stats.total_categories} total, ${stats.active_categories} active`
              : `${items.length} categories`}
          </p>
        </div>
        <Button onClick={() => setFormCategory(null)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Category
        </Button>
      </div>

      <ErrorMessage message={error} />

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats.total_categories}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500">Active</p>
            <p className="text-xl font-bold text-green-600 mt-1">{stats.active_categories}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500">Inactive</p>
            <p className="text-xl font-bold text-red-600 mt-1">{stats.inactive_categories}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-500">Root</p>
            <p className="text-xl font-bold text-indigo-600 mt-1">{stats.root_categories}</p>
          </div>
        </div>
      )}

      {/* Search + View toggle + filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, description..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              view === "list" ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("tree")}
            className={`px-3 py-1.5 text-sm font-medium border-l border-gray-300 transition-colors cursor-pointer ${
              view === "tree" ? "bg-indigo-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Tree
          </button>
        </div>
        {view === "list" && (
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        )}
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="name">Name (A-Z)</option>
          <option value="-name">Name (Z-A)</option>
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
        </select>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              Search: "{search}"
              <button onClick={() => setSearch("")} className="hover:text-indigo-900 cursor-pointer">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filterActive && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filterActive === "true" ? "Active" : "Inactive"}
              <button onClick={() => setFilterActive("")} className="hover:text-indigo-900 cursor-pointer">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          <span className="text-xs text-gray-500 flex items-center">{items.length} result{items.length !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Content */}
      {loading && !items.length ? (
        <div className="py-12 flex justify-center"><Spinner size="lg" /></div>
      ) : view === "tree" ? (
        /* ────────── Tree View ────────── */
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {tree.length > 0 ? (
            tree.map((node) => (
              <TreeNode key={node.id || node.slug} node={node} />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No category tree available.</p>
          )}
        </div>
      ) : (
        /* ────────── List View ────────── */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Slug</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Parent</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Children</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {cat.image ? (
                          <img
                            src={resolveMediaUrl(cat.image)}
                            alt={cat.name}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {cat.name?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{cat.name}</p>
                          {cat.description && (
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{cat.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell font-mono text-xs">
                      {cat.slug}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {cat.parent_name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={cat.is_active ? "Active" : "Inactive"}
                        variant={cat.is_active ? "success" : "danger"}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                      {cat.children?.length || 0}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => setFormCategory(cat)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        {/* Toggle Active */}
                        <button
                          onClick={() => handleToggleActive(cat)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            cat.is_active
                              ? "text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"
                              : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                          }`}
                          title={cat.is_active ? "Deactivate (includes children)" : "Activate"}
                        >
                          {cat.is_active ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteCategory(cat)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CategoryFormModal
        isOpen={formCategory !== undefined}
        onClose={() => setFormCategory(undefined)}
        category={formCategory}
        allCategories={items}
        loading={loading}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        category={deleteCategory}
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
}
