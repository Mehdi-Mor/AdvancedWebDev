import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import CatalogProductCard from '../components/CatalogProductCard.jsx'
import { catalogSections } from '../data/catalog.js'

export default function CatalogPage() {
  return (
    <div className="bg-gray-100 text-gray-800">
      <Header />

      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-black/40" />
          <video
            className="h-[400px] min-w-full object-cover object-bottom md:h-[550px]"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/GuyBikingcompressed.jpg"
          >
            <source src="/images/GuyBikingWebmCompressed.webm" type="video/webm" />
            <source src="/images/Guybiking.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-28 text-white">
          <h1 className="text-4xl font-bold drop-shadow md:text-6xl">Rides for all your needs</h1>
          <p className="mt-4 max-w-prose text-white/90" />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
          Welcome to Our Catalog
        </h2>
        <p className="mx-auto max-w-3xl text-gray-700">
          From traditional bicycles to electric bikes and motor bikes, we have the perfect ride for your adventure.
          Explore our catalog and find your ideal companion for city streets, mountain trails, or weekend fun.
        </p>
      </section>

      {catalogSections.map((section) => (
        <section
          key={section.id}
          className={`mx-auto max-w-6xl px-6 ${section.id === 'motor' ? 'my-8' : ''}`}
        >
          <h2 className="my-8 mb-4 border-b-2 border-green-500 text-2xl font-semibold">{section.title}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <CatalogProductCard
                key={`${section.id}-${item.image}`}
                imageSrc={item.image}
                alt={item.alt}
                description={item.description}
                priceDay={item.day}
                priceAdditional={item.additional}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto my-12 max-w-5xl px-6">
        <h2 className="mb-4 border-b-2 border-green-500 text-center text-2xl font-semibold text-gray-800 md:text-3xl">
          Our beautiful roads
        </h2>
        <video
          className="h-[400px] w-full rounded-lg object-cover shadow-lg md:h-[550px]"
          controls
          preload="metadata"
          poster="/images/finlandimagecompressed.jpg"
        >
          <source src="/images/GuyBikingWebmCompressed.webm" type="video/webm" />
          <source src="/images/Guybiking.mp4" type="video/mp4" />
        </video>
      </section>

      <Footer />
    </div>
  )
}
