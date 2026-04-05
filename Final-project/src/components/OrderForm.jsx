import { useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function OrderForm() {
  const navigate = useNavigate()
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], [])

  function handleSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    navigate('/thanks')
  }

  return (
    <form
      action="/thanks"
      method="get"
      onSubmit={handleSubmit}
      className="mx-auto max-w-5xl px-4 py-9 sm:px-6"
    >
      <section className="mx-auto max-w-5xl px-6 py-9 text-center">
        <h1 className="mb-9 text-4xl font-bold">Order confirmation</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col items-start space-y-4 border border-b-black bg-gray-100 p-4 md:border-b-0 md:border-r md:border-r-black">
            <label htmlFor="product" className="text-2xl font-semibold">
              Choose a product
            </label>
            <select
              id="product"
              name="product"
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="">-- Select a product --</option>
              <option value="city-bike">VTT standard - 20€ / day</option>
              <option value="mountain-bike">VTT with baby seat - 24€ / day</option>
              <option value="electric-scooter">BMX bike - 22€ / day</option>
              <option value="e-bike">Neomouv e-bike - 38€ / day</option>
              <option value="foldable e-bike">Ness Icon foldable e-bike - 34€ / day</option>
              <option value="electric fatbike">Sduro Fatsix electric fatbike - 48€ / day</option>
              <option value="vespa">Vespa scooter - 55€ / day</option>
              <option value="motorcycle">Moto Guzzi motorcycle - 75€ / day</option>
              <option value="dirt bike">KTM 300 XC dirt bike - 85€ / day</option>
            </select>

            <label htmlFor="quantity" className="flex flex-col">
              How many?(1-4)
              <input
                id="quantity"
                name="quantity"
                required
                type="number"
                min={1}
                max={4}
                defaultValue={1}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-64"
              />
            </label>

            <div>
              <span className="text-sm font-medium text-gray-700">
                Pick your rental dates:
              </span>

              <div className="mt-2 flex flex-col sm:flex-row sm:gap-4">
                <div className="flex flex-col">
                  <span className="text-sm">Start date</span>
                  <input
                    id="startDate"
                    name="startDate"
                    required
                    type="date"
                    min={minDate}
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="mt-2 flex flex-col sm:mt-0">
                  <span className="text-sm">End date</span>
                  <input
                    id="endDate"
                    name="endDate"
                    required
                    type="date"
                    min={minDate}
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold">Enter your information</h2>

            <label htmlFor="first-name" className="text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="flex flex-col space-y-1">
              <input
                id="first-name"
                type="text"
                name="first-name"
                required
                autoComplete="given-name"
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
              />
            </div>

            <label htmlFor="last-name" className="text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="flex flex-col space-y-1">
              <input
                id="last-name"
                type="text"
                name="last-name"
                required
                autoComplete="family-name"
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
              />
            </div>

            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="flex flex-col space-y-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email.address@example.com"
              />
            </div>

            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Telephone number
            </label>
            <div className="flex flex-col space-y-1">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E.g. +358 123 4567"
              />
            </div>

            <fieldset className="space-y-2">
              <legend className="mb-1 text-sm font-medium text-gray-700">
                Have you use RideFlow&apos;s services before?
              </legend>

              <div className="flex items-center space-x-2">
                <input
                  id="plan-yes"
                  name="plan"
                  type="radio"
                  value="yes"
                  required
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="plan-yes" className="text-sm text-gray-700">
                  Yes
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="plan-no"
                  name="plan"
                  type="radio"
                  value="no"
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="plan-no" className="text-sm text-gray-700">
                  No
                </label>
              </div>
            </fieldset>

            <div className="mt-4 flex items-center space-x-2">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                I accept the{' '}
                <Link to="/rental-terms" className="text-blue-600 underline">
                  rental terms
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 underline">
                  privacy policy
                </Link>
              </label>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <input
                id="subscribeNewsletter"
                name="subscribeNewsletter"
                type="checkbox"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="subscribeNewsletter" className="text-sm text-gray-700">
                Subscribe to our newsletter
              </label>
            </div>

            <span className="text-sm font-medium text-gray-700">
              Additional notes/wishes
            </span>

            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g. Please add the coolest looking helmet you got"
            />

            <div className="py-9 text-center">
              <button
                type="submit"
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                Submit rental request
              </button>
            </div>
          </div>
        </div>
      </section>
    </form>
  )
}
