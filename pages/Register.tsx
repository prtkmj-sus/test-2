import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';

export const Register: React.FC = () => {
  const [role, setRole] = useState<UserRole.CUSTOMER | UserRole.RETAILER>(UserRole.CUSTOMER);
  const { register } = useStore();
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    phone: '',
    address: '',
    gst: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role,
      businessName: formData.businessName,
      phone: formData.phone,
      address: formData.address
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful</h2>
          <p className="text-gray-600 mb-6">
            {role === UserRole.RETAILER 
              ? "Your retailer application has been submitted and is pending admin approval."
              : "Your account has been created successfully."}
          </p>
          <Link to="/login" className="inline-block bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center">Create an Account</h2>
          <div className="mt-6 flex justify-center">
            <div className="bg-gray-100 p-1 rounded-xl flex">
              <button
                onClick={() => setRole(UserRole.CUSTOMER)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  role === UserRole.CUSTOMER ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setRole(UserRole.RETAILER)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  role === UserRole.RETAILER ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Retailer
              </button>
            </div>
          </div>
        </div>

        {role === UserRole.RETAILER && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
            Register as a retailer to apply your business and purchase networking products at discounted wholesale prices.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {role === UserRole.RETAILER && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                />
              </div>
            )}
            
            <div className={role === UserRole.CUSTOMER ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700">{role === UserRole.RETAILER ? 'Owner Name' : 'Full Name'}</label>
              <input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
              />
            </div>

            <div className={role === UserRole.CUSTOMER ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700">{role === UserRole.RETAILER ? 'Business Email' : 'Email'}</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
              />
            </div>

            {role === UserRole.RETAILER && (
              <>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Business Address</label>
                  <input
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                  />
                </div>
                 <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">GST / Business Reg Number (Optional)</label>
                  <input
                    name="gst"
                    value={formData.gst}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            {role === UserRole.RETAILER ? 'Apply as Retailer' : 'Register as Customer'}
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-secondary hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
