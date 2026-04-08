import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  [
    'hover:text-green-500',
    isActive ? 'border-b-2 border-green-500' : '',
  ].join(' ')

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto flex justify-between items-center p-4">
        <img
          src="/images/ridelogo.PNG"
          alt="RideFlow logo"
          className="mx-6 hidden h-9 md:block"
        />
        <nav className="flex w-full items-center justify-end gap-6 md:w-auto">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/catalog" className={linkClass}>
            Catalog
          </NavLink>
          <NavLink to="/orders" className={linkClass}>
            My orders
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
