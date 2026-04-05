import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function RentalTermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-gray-800">
      <Header />
      <main className="mx-auto max-w-3xl flex-grow p-6">
        <h2 className="mb-4 text-2xl font-bold">Rental Terms</h2>
        <p className="mb-2">1. All rentals must be returned in the same condition.</p>
        <p className="mb-2">2. Customers are responsible for any damages during the rental period.</p>
        <p className="mb-2">3. Rental duration is counted in full days, starting at pickup time.</p>
        <p className="mb-2">4. Cancellation policy: Free cancellation up to 24 hours before pickup.</p>
        <p className="mb-2">5. By using our services, you agree to comply with local traffic laws.</p>
      </main>
      <Footer />
    </div>
  )
}
