import { Link } from "react-router";
import { resolveMediaUrl } from "~/services/mediaUrl";

const PLACEHOLDER_IMG = "https://placehold.co/400x300/e2e8f0/94a3b8?text=Category";

/**
 * CategoryCard — displays a single category in a grid.
 *
 * Shape from CategoryListSerializer:
 * { id, name, slug, image, is_active }
 */
export default function CategoryCard({ category }) {
  const { name, slug, image } = category;
  const imageUrl = resolveMediaUrl(image) || PLACEHOLDER_IMG;

  return (
    <Link
      to={`/categories/${slug}`}
      className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Overlay label */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-4">
        <h3 className="text-white font-semibold text-sm sm:text-lg">{name}</h3>
      </div>
    </Link>
  );
}
