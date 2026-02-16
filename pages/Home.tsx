import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Search, ArrowRight, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { WHOLESALE_DISCOUNT } from '../constants';
import { UserRole } from '../types';

export const Home: React.FC = () => {
  const { products, user } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const featuredProducts = products.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search)}`);
    }
  };

  const getPrice = (price: number) => {
    if (user?.role === UserRole.RETAILER && user.approvalStatus === 'approved') {
      return (price * (1 - WHOLESALE_DISCOUNT));
    }
    return price;
  };

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image and Gradient */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Global Networking Background" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
            Networking Solutions for <br/>
            <span className="text-secondary">
              The Future
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-300 mb-10">
            Upgrade your infrastructure with premium routers, enterprise switches, and high-performance networking equipment designed for speed and reliability.
          </p>
          
          <div className="max-w-xl mx-auto mb-10">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                placeholder="Search for routers, cables, access points..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary shadow-lg"
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 bg-secondary text-white px-6 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center">
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/shop" className="px-8 py-3 rounded-full bg-white text-slate-900 font-bold hover:bg-gray-100 transition-all">
              Shop Products
            </Link>
            {!user && (
              <Link to="/register" className="px-8 py-3 rounded-full bg-secondary text-white font-bold hover:bg-blue-600 transition-all">
                Become a Partner
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="p-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Transactions</h3>
                    <p className="text-gray-500">Your data is protected with enterprise-grade encryption.</p>
                </div>
                <div className="p-6">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Shipping</h3>
                    <p className="text-gray-500">Delivery within 24-48 hours across major cities.</p>
                </div>
                <div className="p-6">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Headphones className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Support</h3>
                    <p className="text-gray-500">24/7 technical assistance for all your networking needs.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 mt-2">Top-rated equipment for your network.</p>
          </div>
          <Link to="/shop" className="text-slate-900 font-semibold flex items-center hover:text-blue-600 transition-colors">
            View All <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 overflow-hidden group">
              <div className="h-64 overflow-hidden bg-gray-50 relative p-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors z-10"></div>
                <img src={product.image} alt={product.name} className="max-h-full w-auto object-contain group-hover:scale-105 transition-transform duration-500" />
                <button 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="absolute bottom-4 right-4 z-20 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white/90 backdrop-blur text-slate-900 px-5 py-2.5 rounded-full font-bold shadow-lg hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm"
                >
                  View Details
                </button>
              </div>
              <div className="p-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">{product.category}</span>
                <h3 className="mt-4 text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="mt-2 text-gray-500 text-sm line-clamp-2">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-slate-900">{formatPrice(getPrice(product.price))}</span>
                    {user?.role === UserRole.RETAILER && user.approvalStatus === 'approved' && (
                      <span className="ml-2 text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Categories Banner */}
      <div className="bg-slate-50 py-24 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
             <h2 className="text-3xl font-bold text-gray-900 mb-10">Shop by Category</h2>
             <div className="flex flex-wrap justify-center gap-6">
                 {['Routers', 'Switches', 'Cables', 'Access Points', 'Storage'].map(cat => (
                     <Link key={cat} to={`/shop?category=${cat}`} className="bg-white px-8 py-4 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-blue-200 hover:text-blue-600 hover:-translate-y-1 transition-all duration-300 font-bold text-gray-700">
                         {cat}
                     </Link>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};