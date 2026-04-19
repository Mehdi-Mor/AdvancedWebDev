import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import HeroOrder from '../components/HeroOrder.jsx'
import OrderForm from '../components/OrderForm.jsx'

export default function OrdersPage() {
  return (
    <div className="bg-gray-100 text-gray-800">
      <Header />
      <HeroOrder />
      <main>
        <OrderForm />
      </main>
      <Footer />
    </div>
  )
}