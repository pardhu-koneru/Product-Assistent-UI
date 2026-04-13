import { Link } from "react-router";
import StarRating from "~/components/common/StarRating";
import { resolveMediaUrl } from "~/services/mediaUrl";

const PLACEHOLDER_IMG = "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";

/**
 * ProductCard — displays a single product in a grid.
 *
 * Shape from ProductListSerializer:
 * { id, title, price, currency, rating_avg, rating_count, is_active, primary_image }
 * primary_image: { id, image, alt_text, is_primary, display_order } | null
 */
export default function ProductCard({ product }) {
  const {
    id,
    title,
    price,
    currency = "USD",
    rating_avg,
    rating_count,
    primary_image,
  } = product;

  const imageUrl = resolveMediaUrl(primary_image?.image) || PLACEHOLDER_IMG;
  const altText = primary_image?.alt_text || title;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);

  return (
    <Link
      to={`/products/${id}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>

        <StarRating rating={rating_avg || 0} count={rating_count} size="sm" />

        <p className="text-sm font-bold text-gray-900 mt-auto">
          {formattedPrice}
        </p>
      </div>
    </Link>
  );
}
