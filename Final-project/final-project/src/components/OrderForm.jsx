import { useMemo, useState } from 'react'
import { z } from 'zod'
import { Link } from 'react-router-dom'

const orderSchema = z
  .object({
    product: z.string().min(1, 'Choose a product'),
    quantity: z.number().min(1, 'Quantity must be at least 1').max(4, 'Quantity can be at most 4'),
    startDate: z.string().min(1, 'Choose a start date'),
    endDate: z.string().min(1, 'Choose an end date'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phoneNumber: z.string().min(5, 'Please enter a valid telephone number'),
    plan: z.string().min(1, 'Please select an answer'),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: 'You must accept the terms',
    }),
    subscribeNewsletter: z.boolean(),
    message: z.string().optional(),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: 'End date must be the same or after the start date',
    path: ['endDate'],
  })

const initialFormData = {
  product: '',
  quantity: 1,
  startDate: '',
  endDate: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  plan: '',
  acceptTerms: false,
  subscribeNewsletter: false,
  message: '',
}

export default function OrderForm() {
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], [])
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [apiResponse, setApiResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : type === 'number' ? Number(value) : value

    setFormData((prevData) => ({
      ...prevData,
      [name]: nextValue,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage('')
    setApiResponse(null)

    const result = orderSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors = {}
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]
        fieldErrors[fieldName] = issue.message
      })
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    setErrors({})

    try {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data),
      })

      const data = await response.json()
      setApiResponse(data)
      setSuccessMessage('Form submitted and sent to server successfully!')
    } catch (error) {
      setSuccessMessage('Something went wrong while sending data. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-4 py-9 sm:px-6">
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
              value={formData.product}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {errors.product && <p className="text-left text-sm text-red-600">{errors.product}</p>}

            <label htmlFor="quantity" className="flex flex-col">
              How many?(1-4)
              <input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                max={4}
                value={formData.quantity}
                onChange={handleChange}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-64"
              />
            </label>
            {errors.quantity && <p className="text-left text-sm text-red-600">{errors.quantity}</p>}

            <div className="w-full">
              <span className="text-sm font-medium text-gray-700">Pick your rental dates:</span>

              <div className="mt-2 flex flex-col sm:flex-row sm:gap-4">
                <div className="flex flex-col">
                  <span className="text-sm">Start date</span>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={minDate}
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="mt-2 flex flex-col sm:mt-0">
                  <span className="text-sm">End date</span>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || minDate}
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              {errors.endDate && <p className="text-left text-sm text-red-600">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold">Enter your information</h2>

            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="flex flex-col space-y-1">
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-left text-sm text-red-600">{errors.firstName}</p>}
            </div>

            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="flex flex-col space-y-1">
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-left text-sm text-red-600">{errors.lastName}</p>}
            </div>

            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="flex flex-col space-y-1">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email.address@example.com"
              />
              {errors.email && <p className="text-left text-sm text-red-600">{errors.email}</p>}
            </div>

            <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
              Telephone number
            </label>
            <div className="flex flex-col space-y-1">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E.g. +358 123 4567"
              />
              {errors.phoneNumber && <p className="text-left text-sm text-red-600">{errors.phoneNumber}</p>}
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
                  checked={formData.plan === 'yes'}
                  onChange={handleChange}
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
                  checked={formData.plan === 'no'}
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="plan-no" className="text-sm text-gray-700">
                  No
                </label>
              </div>
              {errors.plan && <p className="text-left text-sm text-red-600">{errors.plan}</p>}
            </fieldset>

            <div className="mt-4 flex items-center space-x-2">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
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
            {errors.acceptTerms && <p className="text-left text-sm text-red-600">{errors.acceptTerms}</p>}

            <div className="mt-4 flex items-center space-x-2">
              <input
                id="subscribeNewsletter"
                name="subscribeNewsletter"
                type="checkbox"
                checked={formData.subscribeNewsletter}
                onChange={handleChange}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="subscribeNewsletter" className="text-sm text-gray-700">
                Subscribe to our newsletter
              </label>
            </div>

            <span className="text-sm font-medium text-gray-700">Additional notes/wishes</span>

            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g. Please add the coolest looking helmet you got"
            />

            <div className="py-9 text-center">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {loading ? 'Submitting...' : 'Submit rental request'}
              </button>
            </div>
          </div>
        </div>

        {successMessage && <p className="mt-6 text-left text-green-700">{successMessage}</p>}

        {apiResponse && (
          <div className="mt-6 rounded-xl bg-white p-5 shadow-sm text-left">
            <h2 className="mb-3 text-2xl font-semibold">Server response</h2>
            <pre className="overflow-x-auto rounded bg-slate-950 p-4 text-sm text-slate-100">
              {JSON.stringify(apiResponse.json, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </form>
  )
}
