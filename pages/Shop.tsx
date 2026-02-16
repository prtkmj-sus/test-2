import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { WHOLESALE_DISCOUNT } from '../constants';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, user } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

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

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, searchQuery]);

  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-gray-500" />
              <h2 className="font-bold text-gray-900">Filters</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Categories</h3>
                <div className="space-y-2">
                  <button 
                    onClick={() => setSearchParams({})}
                    className={`block w-full text-left text-sm ${!categoryFilter ? 'text-secondary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    All Products
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSearchParams({ category: cat })}
                      className={`block w-full text-left text-sm ${categoryFilter === cat ? 'text-secondary font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryFilter || 'All Products'}
              <span className="ml-2 text-sm font-normal text-gray-500">({filteredProducts.length} items)</span>
            </h1>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchParams(prev => {
                  prev.set('search', e.target.value);
                  return prev;
                })}
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 w-full sm:w-64 text-gray-900"
              />
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button onClick={() => setSearchParams({})} className="mt-4 text-secondary font-medium hover:underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="group block bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-secondary uppercase mb-1">{product.category}</p>
                    <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-secondary transition-colors">{product.name}</h3>
                    <div className="flex items-baseline gap-2">
                       <span className="text-lg font-bold text-slate-900">{formatPrice(getPrice(product.price))}</span>
                       {user?.role === UserRole.RETAILER && user.approvalStatus === 'approved' && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
                       )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
