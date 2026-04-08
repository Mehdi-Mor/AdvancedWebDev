import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function ThanksPage() {
  return (
    <div className="bg-gray-100 text-gray-800">
      <Header />
      <div
        className="relative h-[350px] bg-cover bg-bottom md:h-[550px]"
        style={{
          backgroundImage: "url('/images/7732616_5243.svg')",
        }}
      />
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="mb-4 text-4xl font-bold">Thank you for your order!</h1>
        <p className="mb-8 text-gray-700">
          Your order has been saved successfully. Please check your email for any updates.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/"
            className="rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600"
          >
            Return to Home
          </Link>
          <Link
            to="/orders"
            className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Make another booking
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}
