import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "~/store/thunks/productsThunks";
import { fetchReviews } from "~/store/thunks/reviewsThunks";
import { clearSelectedProduct } from "~/store/slices/productsSlice";
import { clearReviews } from "~/store/slices/reviewsSlice";
import ImageGallery from "~/components/products/ImageGallery";
import ProductInfo from "~/components/products/ProductInfo";
import ReviewCard from "~/components/reviews/ReviewCard";
import ReviewForm from "~/components/reviews/ReviewForm";
import Spinner from "~/components/common/Spinner";
import ErrorMessage from "~/components/common/ErrorMessage";
import EmptyState from "~/components/common/EmptyState";

/**
 * ProductDetailPage — full product view at /products/:id
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct: product, loading, error } = useSelector(
    (state) => state.products
  );
  const {
    items: reviews,
    loading: reviewsLoading,
    error: reviewsError,
  } = useSelector((state) => state.reviews);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedImg, setSelectedImg] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchReviews({ productId: id }));
    }
    return () => {
      dispatch(clearSelectedProduct());
      dispatch(clearReviews());
    };
  }, [id, dispatch]);

  useEffect(() => {
    setSelectedImg(0);
  }, [product?.id]);

  if (loading && !product) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 max-w-md mx-auto px-4">
        <ErrorMessage message={error} />
        <Link to="/" className="block text-center mt-4 text-indigo-600 font-medium hover:text-indigo-700">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.filter((img) => img.image) || [];
  const hasImages = images.length > 0;
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency || "USD",
  }).format(product.price);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 overflow-x-auto">
        <Link to="/" className="hover:text-indigo-600 shrink-0">Home</Link>
        <span>/</span>
        {product.category_name && (
          <>
            <Link to="/categories" className="hover:text-indigo-600 shrink-0">Categories</Link>
            <span>/</span>
            <span className="text-gray-700 shrink-0">{product.category_name}</span>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium truncate">{product.title}</span>
      </nav>

      {/* Image + Info */}
      <div className={`grid grid-cols-1 ${hasImages ? "lg:grid-cols-2" : ""} gap-6 sm:gap-10`}>
        {hasImages && (
          <ImageGallery images={images} selectedIdx={selectedImg} onSelect={setSelectedImg} title={product.title} />
        )}
        <ProductInfo product={product} formattedPrice={formattedPrice} />
      </div>

      {/* Reviews */}
      <section className="border-t border-gray-200 pt-6 sm:pt-8 space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          Customer Reviews ({reviews.length})
        </h2>
        {isAuthenticated && <ReviewForm productId={product.id} />}
        {reviewsError && <ErrorMessage message={reviewsError} />}
        {reviewsLoading && reviews.length === 0 ? (
          <div className="py-8 flex justify-center"><Spinner size="md" /></div>
        ) : reviews.length === 0 ? (
          <EmptyState title="No reviews yet" description="Be the first to review this product" icon="💬" />
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}
