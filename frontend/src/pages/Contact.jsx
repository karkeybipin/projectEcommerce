import React, { useState } from "react";
import { Send, User, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    queries: ''
  });

  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/contact/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Your query has been submitted successfully!');
        setFormData({ name: '', email: '', phone: '', address: '', queries: '' });
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      alert('Failed to submit query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-10">
        <h1 className="text-4xl font-semibold text-slate-900 mb-6 text-center">
          Get In Touch
        </h1>
        <p className="text-center text-slate-600 mb-10 max-w-xl mx-auto">
          Ready to start your journey with us? Drop us a message and let's create something amazing together.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="Full Name"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition focus:outline-none ${
                focusedField === 'name'
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-300 focus:border-blue-400'
              } text-slate-900 placeholder-slate-400`}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              placeholder="Email Address"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition focus:outline-none ${
                focusedField === 'email'
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-300 focus:border-blue-400'
              } text-slate-900 placeholder-slate-400`}
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
              placeholder="Phone Number"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition focus:outline-none ${
                focusedField === 'phone'
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-300 focus:border-blue-400'
              } text-slate-900 placeholder-slate-400`}
            />
          </div>

          {/* Address */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('address')}
              onBlur={() => setFocusedField(null)}
              placeholder="Address"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition focus:outline-none ${
                focusedField === 'address'
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-300 focus:border-blue-400'
              } text-slate-900 placeholder-slate-400`}
            />
          </div>

          {/* Queries */}
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 text-slate-400" />
            <textarea
              name="queries"
              value={formData.queries}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('queries')}
              onBlur={() => setFocusedField(null)}
              required
              rows="4"
              placeholder="Tell us about your project, questions, or how we can help you..."
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition focus:outline-none resize-none ${
                focusedField === 'queries'
                  ? 'border-blue-500 shadow-md'
                  : 'border-gray-300 focus:border-blue-400'
              } text-slate-900 placeholder-slate-400`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
