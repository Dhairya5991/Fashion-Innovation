import React, { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would send the message to your backend
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white text-center">Contact Us</h1>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-3xl mb-2">📧</div>
            <h3 className="font-semibold text-white mb-2">Email</h3>
            <p className="text-gray-300">support@arfashion.com</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-semibold text-white mb-2">Phone</h3>
            <p className="text-gray-300">+91 12345 67890</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="text-3xl mb-2">📍</div>
            <h3 className="font-semibold text-white mb-2">Address</h3>
            <p className="text-gray-300">Mumbai, India</p>
          </div>
        </div>
      </div>
    </div>
  )
}