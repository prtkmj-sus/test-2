import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { generateProductRecommendation } from '../services/gemini';
import { WHOLESALE_DISCOUNT, RETAILER_MIN_QUANTITY } from '../constants';
import { UserRole, ApprovalStatus } from '../types';
import { Check, ShoppingCart, Star, Sparkles, ArrowLeft, Info } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, user, addToCart } = useStore();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState<string>('');
  
  const isRetailer = user?.role === UserRole.RETAILER;
  const initialQty = isRetailer ? RETAILER_MIN_QUANTITY : 1;
  const [quantity, setQuantity] = useState(initialQty);
  const [loadingAI, setLoadingAI] = useState(false);

  // Update quantity when user logs in/out or role changes
  useEffect(() => {
    setQuantity(isRetailer ? RETAILER_MIN_QUANTITY : 1);
  }, [isRetailer]);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      setLoadingAI(true);
      generateProductRecommendation(`I am looking at ${product.name}. What else should I buy with this?`, products)
        .then(setRecommendation)
        .finally(() => setLoadingAI(false));
    }
  }, [product, products]);

  if (!product) return <div className="p-10 text-center">Product not found</div>;

  const price = isRetailer && user.approvalStatus === ApprovalStatus.APPROVED
    ? product.price * (1 - WHOLESALE_DISCOUNT)
    : product.price;

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  const decreaseQuantity = () => {
    const min = isRetailer ? RETAILER_MIN_QUANTITY : 1;
    setQuantity(Math.max(min, quantity - 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gray-50 p-12 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-w-full h-auto rounded-lg shadow-lg" />
          </div>
          
          <div className="p-10 flex flex-col">
            <div className="mb-auto">
              <span className="inline-block px-3 py-1 bg-blue-50 text-secondary text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">{product.description}</p>
              
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-xs text-gray-500 uppercase">{key}</span>
                      <span className="block font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-8 mt-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">{formatPrice(price)}</span>
                    {isRetailer && user.approvalStatus === ApprovalStatus.APPROVED && (
                       <div className="flex flex-col">
                         <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                         <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full mt-1">Wholesale Pricing</span>
                       </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                    <button 
                      onClick={decreaseQuantity} 
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-l-lg font-bold text-lg disabled:opacity-50"
                      disabled={isRetailer && quantity <= RETAILER_MIN_QUANTITY}
                    >-</button>
                    <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-r-lg font-bold text-lg"
                    >+</button>
                  </div>
                  {isRetailer && (
                    <p className="text-xs text-orange-600 mt-2 flex items-center justify-end gap-1">
                      <Info className="w-3 h-3" /> Min. {RETAILER_MIN_QUANTITY} items for wholesale
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 bg-slate-900 text-white py-4 px-6 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                >
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Section */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-100">
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-full shadow-sm text-indigo-500">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Recommendation</h3>
            {loadingAI ? (
               <div className="animate-pulse h-4 bg-indigo-200 rounded w-64"></div>
            ) : (
              <p className="text-gray-700 leading-relaxed italic">
                "{recommendation}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};