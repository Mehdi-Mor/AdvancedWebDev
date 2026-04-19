import { Link } from 'react-router-dom'

export default function CatalogProductCard({
  imageSrc,
  alt,
  description,
  priceDay,
  priceAdditional,
}) {
  return (
    <div className="flex flex-col items-center">
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        className="m-3 aspect-square w-full rounded-lg border border-gray-300 bg-white object-contain shadow-lg transition hover:scale-105"
      />
      <p className="mt-2 text-center font-medium">{description}</p>
      <div className="m-2 rounded-lg text-left font-bold">
        <p>{priceDay}</p>
        <p>{priceAdditional}</p>
      </div>
      <Link
        to="/orders"
        className="m-2 rounded-lg border border-gray-300 bg-green-500 p-2 text-center text-white shadow-lg transition hover:bg-green-600"
      >
        Add to cart
      </Link>
    </div>
  )
}
