import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import ThanksPage from './pages/ThanksPage.jsx'
import RentalTermsPage from './pages/RentalTermsPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/thanks" element={<ThanksPage />} />
      <Route path="/rental-terms" element={<RentalTermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}