import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-gray-800">
      <Header />
      <main className="mx-auto max-w-3xl flex-grow p-6">
        <h2 className="mb-4 text-2xl font-bold">Privacy Policy</h2>
        <p className="mb-2">1. We respect your privacy and do not share your personal information without consent.</p>
        <p className="mb-2">2. Your data is used only to process rentals, send updates, and improve our services.</p>
        <p className="mb-2">3. You may unsubscribe from newsletters at any time via the link provided.</p>
        <p className="mb-2">4. Cookies are used to enhance website experience; no personal data is stored in cookies.</p>
      </main>
      <Footer />
    </div>
  )
}
