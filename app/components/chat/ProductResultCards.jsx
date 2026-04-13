import { Link } from "react-router";
import { resolveMediaUrl } from "~/services/mediaUrl";

/**
 * ProductResultCards — horizontal scrollable row of clickable product cards
 * rendered below an assistant message when the RAG response includes products.
 */
export default function ProductResultCards({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <p className="text-xs font-medium text-gray-500 mb-2">Referenced Products</p>
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="flex-shrink-0 w-36 sm:w-40 rounded-xl border border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200 overflow-hidden group"
          >
            {/* Image */}
            <div className="h-24 sm:h-28 bg-gray-50 flex items-center justify-center overflow-hidden">
              {product.primary_image ? (
                <img
                  src={resolveMediaUrl(product.primary_image)}
                  alt={product.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            {/* Details */}
            <div className="p-2">
              <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">
                {product.title}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-semibold text-indigo-600">
                  {product.currency === "INR" ? "₹" : "$"}
                  {Number(product.price).toLocaleString()}
                </span>
                {product.rating_avg > 0 && (
                  <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
                    <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {product.rating_avg.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
