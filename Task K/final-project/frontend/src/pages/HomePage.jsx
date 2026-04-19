import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function HomePage() {
  return (
    <div className="bg-gray-100 text-gray-800">
      <Header />
      <section
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/landing.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-transparent" />
        <div className="relative p-4 text-right text-white sm:p-6 md:p-8">
          <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">Welcome to RideFlow Rentals</h1>
          <p className="text-lg font-bold italic sm:text-xl md:text-2xl">Easy bike rentals for everyone</p>
        </div>
      </section>
      <main>
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 p-6">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <img
              src="/images/motorcycle.jpg"
              className="w-full rounded-xl"
              alt="motorcycle image"
            />
            <div>
              <h2 className="mb-2 text-2xl font-bold">Explore the Cities With Ease</h2>
              <p>
                We make bike renting effortless for everyone. Whether you&apos;re commuting, visiting country or
                spending the day outdoors, RideFlow Rentals offers simple, affordable and reliable options in multiple
                locations across Finland.
              </p>
            </div>
          </div>

          <div className="grid items-center gap-6 md:grid-cols-2">
            <img
              src="/images/ebike.jpg"
              className="w-full rounded-xl md:order-2"
              alt="ebike image"
            />
            <div className="md:order-1">
              <h2 className="mb-2 text-2xl font-bold">Enjoy Scenic Routes & Outdoor Adventures</h2>
              <p>
                From peaceful park trails to coastline roads, our routes allow you to enjoy the Finnish nature while
                traveling sustainably. Ride solo or with friends and family — your journey starts with the right bike.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
