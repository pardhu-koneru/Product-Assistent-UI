import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  adminFetchProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminAddAttributes,
  adminUploadImage,
  adminToggleActive,
  adminFetchStats,
  adminProcessAI,
  adminBatchProcessAI,
} from "~/store/thunks/adminProductsThunks";
import { adminFetchCategories } from "~/store/thunks/adminCategoriesThunks";
import { clearError } from "~/store/slices/adminProductsSlice";
import useDebounce from "~/hooks/useDebounce";
import Spinner from "~/components/common/Spinner";
import ErrorMessage from "~/components/common/ErrorMessage";
import Badge from "~/components/common/Badge";
import Button from "~/components/common/Button";
import Modal from "~/components/common/Modal";
import { resolveMediaUrl } from "~/services/mediaUrl";

/* ================================================================== */
/*  Create / Edit Product Modal                                        */
/* ================================================================== */
function ProductFormModal({ isOpen, onClose, product, categories, loading }) {
  const dispatch = useDispatch();
  const isEdit = !!product;
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (product) {
      reset({
        title: product.title || "",
        description: product.description || "",
        brand: product.brand || "",
        category: product.category || "",
        price: product.price || "",
        currency: product.currency || "USD",
        stock_quantity: product.stock_quantity ?? 0,
        is_active: product.is_active ?? true,
      });
    } else {
      reset({
        title: "",
        description: "",
        brand: "",
        category: "",
        price: "",
        currency: "USD",
        stock_quantity: 0,
        is_active: true,
      });
    }
  }, [product, reset, isOpen]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
      stock_quantity: parseInt(data.stock_quantity, 10),
      is_active: data.is_active === true || data.is_active === "true",
    };

    if (isEdit) {
      await dispatch(adminUpdateProduct({ id: product.id, ...payload }));
    } else {
      await dispatch(adminCreateProduct(payload));
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Product" : "Create Product"} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              {...register("title", { required: "Title is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              {...register("description", { required: "Description is required" })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              {...register("brand")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white cursor-pointer"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <input
              {...register("price", { required: "Price is required", min: { value: 0.01, message: "Must be > 0" } })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              {...register("currency")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white cursor-pointer"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
            <input
              {...register("stock_quantity", { min: { value: 0, message: "Cannot be negative" } })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              {...register("is_active")}
              type="checkbox"
              id="is_active"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700 cursor-pointer">Active</label>
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
/*  Add Attributes Modal                                               */
/* ================================================================== */
function AddAttributesModal({ isOpen, onClose, product, loading }) {
  const dispatch = useDispatch();
  const [pairs, setPairs] = useState([{ key: "", value: "" }]);

  const addPair = () => setPairs([...pairs, { key: "", value: "" }]);
  const removePair = (i) => setPairs(pairs.filter((_, idx) => idx !== i));
  const updatePair = (i, field, val) => {
    const updated = [...pairs];
    updated[i][field] = val;
    setPairs(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const attributes = {};
    pairs.forEach(({ key, value }) => {
      if (key.trim()) attributes[key.trim()] = value.trim();
    });
    if (Object.keys(attributes).length === 0) return;
    await dispatch(adminAddAttributes({ id: product.id, attributes }));
    setPairs([{ key: "", value: "" }]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Attributes — ${product?.title}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Existing attributes */}
        {product?.attributes?.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-500 mb-2">Existing Attributes</p>
            <div className="flex flex-wrap gap-2">
              {product.attributes.map((a) => (
                <span key={a.id} className="bg-white border border-gray-200 px-2 py-1 rounded text-xs text-gray-700">
                  <span className="font-medium">{a.key}:</span> {a.value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* New attributes */}
        <div className="space-y-2">
          {pairs.map((pair, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={pair.key}
                onChange={(e) => updatePair(i, "key", e.target.value)}
                placeholder="Key (e.g. Color)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              <input
                value={pair.value}
                onChange={(e) => updatePair(i, "value", e.target.value)}
                placeholder="Value (e.g. Red)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
              {pairs.length > 1 && (
                <button type="button" onClick={() => removePair(i)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addPair}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
          + Add another attribute
        </button>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save Attributes</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ================================================================== */
/*  Upload Image Modal                                                 */
/* ================================================================== */
function UploadImageModal({ isOpen, onClose, product, loading }) {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [altText, setAltText] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("alt_text", altText);
    formData.append("is_primary", isPrimary);
    await dispatch(adminUploadImage({ id: product.id, formData }));
    setAltText("");
    setIsPrimary(false);
    setPreview(null);
    onClose();
    // Refresh product list to show new image
    dispatch(adminFetchProducts());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Upload Image — ${product?.title}`} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Existing images */}
        {product?.images?.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-500 mb-2">Current Images</p>
            <div className="flex gap-2 flex-wrap">
              {product.images.map((img) => (
                <img
                  key={img.id}
                  src={resolveMediaUrl(img.image)}
                  alt={img.alt_text || "Product"}
                  className={`w-16 h-16 object-cover rounded-lg border-2 ${img.is_primary ? "border-indigo-500" : "border-gray-200"}`}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image File *</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer cursor-pointer"
          />
        </div>
        {preview && (
          <img src={preview} alt="Preview" className="w-full max-h-48 object-contain rounded-lg border border-gray-200" />
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_primary_img"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
          />
          <label htmlFor="is_primary_img" className="text-sm text-gray-700 cursor-pointer">Set as primary image</label>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Upload</Button>
        </div>
      </form>
    </Modal>
  );
}

/* ================================================================== */
/*  Confirm Delete Modal                                               */
/* ================================================================== */
function ConfirmDeleteModal({ isOpen, onClose, product, loading, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Product" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold">{product?.title}</span>?
          This action cannot be undone.
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
/*  Admin Products Page                                                */
/* ================================================================== */
export default function AdminProducts() {
  const dispatch = useDispatch();
  const { items, stats, loading, error } = useSelector((s) => s.adminProducts);
  const { items: categories } = useSelector((s) => s.adminCategories);

  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStock, setFilterStock] = useState(""); // "" | "true" | "false"
  const [ordering, setOrdering] = useState("-created_at");
  const [formProduct, setFormProduct] = useState(undefined); // undefined=closed, null=create, object=edit
  const [attrProduct, setAttrProduct] = useState(null);
  const [imageProduct, setImageProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const params = {};
    if (filterActive !== "") params.isActive = filterActive === "true";
    if (filterCategory) params.categoryId = filterCategory;
    if (filterStock !== "") params.inStock = filterStock === "true";
    if (debouncedSearch) params.search = debouncedSearch;
    if (ordering) params.ordering = ordering;
    dispatch(adminFetchProducts(params));
    dispatch(adminFetchCategories());
    dispatch(adminFetchStats());
  }, [dispatch, filterActive, filterCategory, filterStock, debouncedSearch, ordering]);

  const hasActiveFilters = search || filterActive || filterCategory || filterStock;

  const handleClearFilters = () => {
    setSearch("");
    setFilterActive("");
    setFilterCategory("");
    setFilterStock("");
    setOrdering("-created_at");
  };

  const handleDelete = async () => {
    await dispatch(adminDeleteProduct(deleteProduct.id));
    setDeleteProduct(null);
  };

  const handleProcessAI = (id) => {
    dispatch(adminProcessAI(id));
  };

  const handleBatchAI = () => {
    if (selectedIds.length === 0) return;
    dispatch(adminBatchProcessAI(selectedIds));
    setSelectedIds([]);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((p) => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-500 mt-1">
            {stats ? `${stats.total_products} total, ${stats.active_products} active, ${stats.in_stock_products} in stock` : `${items.length} products`}
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button variant="secondary" onClick={handleBatchAI} className="text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              Batch AI ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => setFormProduct(null)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Product
          </Button>
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* Filters */}
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
            placeholder="Search by title, description, brand..."
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
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">All Stock</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="-created_at">Newest First</option>
          <option value="created_at">Oldest First</option>
          <option value="title">Title (A-Z)</option>
          <option value="-title">Title (Z-A)</option>
          <option value="price">Price (Low-High)</option>
          <option value="-price">Price (High-Low)</option>
          <option value="-stock_quantity">Stock (High-Low)</option>
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
          {filterCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              Category: {categories.find((c) => c.id === filterCategory)?.name || filterCategory}
              <button onClick={() => setFilterCategory("")} className="hover:text-indigo-900 cursor-pointer">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filterStock && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filterStock === "true" ? "In Stock" : "Out of Stock"}
              <button onClick={() => setFilterStock("")} className="hover:text-indigo-900 cursor-pointer">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          <span className="text-xs text-gray-500 flex items-center">{items.length} result{items.length !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Product grid / table */}
      {loading && !items.length ? (
        <div className="py-12 flex justify-center"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === items.length && items.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((product) => {
                  const primaryImg = product.images?.find((i) => i.is_primary) || product.images?.[0];
                  return (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleSelect(product.id)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {primaryImg ? (
                            <img
                              src={resolveMediaUrl(primaryImg.image)}
                              alt={primaryImg.alt_text || product.title}
                              className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[200px]">{product.title}</p>
                            {product.brand && <p className="text-xs text-gray-500">{product.brand}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                        {product.category_name || "—"}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {product.currency} {parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <Badge
                          label={product.stock_quantity > 0 ? `${product.stock_quantity} units` : "Out of stock"}
                          variant={product.stock_quantity > 0 ? "success" : "danger"}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          label={product.is_active ? "Active" : "Inactive"}
                          variant={product.is_active ? "success" : "danger"}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {/* Edit */}
                          <button
                            onClick={() => setFormProduct(product)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          {/* Attributes */}
                          <button
                            onClick={() => setAttrProduct(product)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors cursor-pointer"
                            title="Attributes"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                            </svg>
                          </button>
                          {/* Upload Image */}
                          <button
                            onClick={() => setImageProduct(product)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title="Upload Image"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                          </button>
                          {/* Process AI */}
                          <button
                            onClick={() => handleProcessAI(product.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Process with AI"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                            </svg>
                          </button>
                          {/* Toggle Active */}
                          <button
                            onClick={() => dispatch(adminToggleActive(product.id))}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              product.is_active
                                ? "text-gray-500 hover:text-yellow-600 hover:bg-yellow-50"
                                : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                            }`}
                            title={product.is_active ? "Deactivate" : "Activate"}
                          >
                            {product.is_active ? (
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
                            onClick={() => setDeleteProduct(product)}
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
                  );
                })}
                {!items.length && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={formProduct !== undefined}
        onClose={() => setFormProduct(undefined)}
        product={formProduct}
        categories={categories}
        loading={loading}
      />
      <AddAttributesModal
        isOpen={!!attrProduct}
        onClose={() => setAttrProduct(null)}
        product={attrProduct}
        loading={loading}
      />
      <UploadImageModal
        isOpen={!!imageProduct}
        onClose={() => setImageProduct(null)}
        product={imageProduct}
        loading={loading}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        product={deleteProduct}
        loading={loading}
        onConfirm={handleDelete}
      />
    </div>
  );
}
