import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Trash2, ArrowRight, ShoppingBag, AlertTriangle, Info } from 'lucide-react';
import { WHOLESALE_DISCOUNT, RETAILER_MIN_QUANTITY } from '../constants';
import { UserRole, ApprovalStatus } from '../types';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateCartQuantity, user } = useStore();
  const navigate = useNavigate();

  const isRetailer = user?.role === UserRole.RETAILER;
  const isApprovedRetailer = isRetailer && user?.approvalStatus === ApprovalStatus.APPROVED;

  const getPrice = (price: number) => {
    if (isApprovedRetailer) {
      return price * (1 - WHOLESALE_DISCOUNT);
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

  const total = cart.reduce((sum, item) => sum + (getPrice(item.price) * item.quantity), 0);
  const isUnapprovedRetailer = isRetailer && user.approvalStatus !== ApprovalStatus.APPROVED;

  // Enforce retailer minimum quantity in UI logic
  const handleQuantityUpdate = (itemId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    const minQty = isRetailer ? RETAILER_MIN_QUANTITY : 1;
    
    // If decreasing below 1, remove (standard behavior)
    // If retailer tries to go below minQty but > 0, we should block it or show warning
    // But standard UX for '-' button: if at min, disable it. 
    // If user calls this function directly, we enforce bounds.
    
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (isRetailer && newQty < RETAILER_MIN_QUANTITY) {
      // If they are trying to go below limit, we don't update.
      // But if they are removing, that's fine. 
      // Assuming this handler is for + / - buttons.
      // If they really want to remove, they use trash icon.
      return; 
    }

    updateCartQuantity(itemId, newQty);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added any networking gear to your cart yet.</p>
        <Link to="/shop" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-50" />
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                <div className="font-semibold text-slate-900">
                   {formatPrice(getPrice(item.price))}
                   {isApprovedRetailer && (
                     <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(item.price)}</span>
                   )}
                </div>
                {isRetailer && item.quantity < RETAILER_MIN_QUANTITY && (
                  <p className="text-xs text-red-500 mt-1">Quantity below wholesale limit ({RETAILER_MIN_QUANTITY})</p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button 
                      onClick={() => handleQuantityUpdate(item.id, item.quantity, -1)}
                      className={`w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg ${isRetailer && item.quantity <= RETAILER_MIN_QUANTITY ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isRetailer && item.quantity <= RETAILER_MIN_QUANTITY}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityUpdate(item.id, item.quantity, 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {isRetailer && (
                  <span className="text-[10px] text-gray-400">Min Qty: {RETAILER_MIN_QUANTITY}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (Estimated 18%)</span>
                <span>{formatPrice(total * 0.18)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>{formatPrice(total * 1.18)}</span>
              </div>
            </div>

            {isUnapprovedRetailer ? (
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mb-4">
                 <div className="flex gap-3">
                   <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                   <p className="text-sm text-yellow-800">
                     Your retailer account is currently <strong>{user?.approvalStatus}</strong>. You cannot place orders until an admin approves your account.
                   </p>
                 </div>
               </div>
            ) : (
              <>
                {isRetailer && (
                   <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex gap-2">
                     <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                     <p className="text-xs text-blue-800">
                       Bulk pricing applied. Minimum {RETAILER_MIN_QUANTITY} items per product required.
                     </p>
                   </div>
                )}
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>
              </>
            )}
            
            <div className="mt-6 text-center">
              <Link to="/shop" className="text-sm text-gray-500 hover:text-gray-900">
                or Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};