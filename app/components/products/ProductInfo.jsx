import StarRating from "~/components/common/StarRating";
import Badge from "~/components/common/Badge";

/**
 * ProductInfo — right-side panel on product detail page.
 * Shows title, brand, category, rating, price, stock, description, attributes.
 */
export default function ProductInfo({ product, formattedPrice }) {
  const inStock = product.stock_quantity > 0;

  return (
    <div className="space-y-5">
      {/* Title */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
        {product.title}
      </h1>

      {/* Brand + Category */}
      <div className="flex items-center gap-3 flex-wrap">
        {product.brand && <Badge label={product.brand} variant="info" />}
        {product.category_name && (
          <Badge label={product.category_name} variant="neutral" />
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <StarRating
          rating={product.rating_avg || 0}
          count={product.rating_count}
          size="md"
        />
      </div>

      {/* Price */}
      <p className="text-2xl sm:text-3xl font-bold text-gray-900">
        {formattedPrice}
      </p>

      {/* Stock */}
      <div className="flex items-center gap-2">
        {inStock ? (
          <>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="text-green-700 font-medium text-sm">
              In Stock ({product.stock_quantity} available)
            </span>
          </>
        ) : (
          <>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-red-700 font-medium text-sm">Out of Stock</span>
          </>
        )}
      </div>

      {/* Description */}
      {product.description && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
            {product.description}
          </p>
        </div>
      )}

      {/* Attributes / Specifications */}
      {product.attributes && product.attributes.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Specifications
          </h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {product.attributes.map((attr, idx) => (
                  <tr
                    key={attr.id}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-3 sm:px-4 py-2 font-medium text-gray-700 w-1/3 capitalize">
                      {attr.key}
                    </td>
                    <td className="px-3 sm:px-4 py-2 text-gray-600">
                      {attr.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
