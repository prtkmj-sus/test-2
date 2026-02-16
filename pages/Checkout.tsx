import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CreditCard, CheckCircle, ShieldAlert, QrCode, Landmark, Smartphone, Lock } from 'lucide-react';
import { UserRole, ApprovalStatus } from '../types';
import { WHOLESALE_DISCOUNT } from '../constants';

export const Checkout: React.FC = () => {
  const { cart, placeOrder, user } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState(user?.address || '');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'netbanking' | 'upi'>('card');

  const getPrice = (price: number) => {
    if (user?.role === UserRole.RETAILER && user.approvalStatus === ApprovalStatus.APPROVED) {
      return price * (1 - WHOLESALE_DISCOUNT);
    }
    return price;
  };

  const subtotal = cart.reduce((sum, item) => sum + (getPrice(item.price) * item.quantity), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  // Check for unapproved retailer
  if (user?.role === UserRole.RETAILER && user.approvalStatus !== ApprovalStatus.APPROVED) {
     return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Approval Required</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Your retailer account is currently pending approval. You cannot place orders until an administrator approves your account.
        </p>
        <button onClick={() => navigate('/shop')} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800">
          Return to Shop
        </button>
      </div>
    );
  }

  if (cart.length === 0 && step === 1) {
    navigate('/shop');
    return null;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment processing
    setTimeout(async () => {
      await placeOrder(address);
      setLoading(false);
      setStep(3);
    }, 2000);
  };

  if (step === 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Thank you for your purchase. We have received your order and will begin processing it immediately.
        </p>
        <div className="flex gap-4">
           <button onClick={() => navigate('/dashboard')} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800">
             View Order
           </button>
           <button onClick={() => navigate('/')} className="text-gray-600 px-6 py-2 font-medium hover:text-gray-900">
             Back Home
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
        <div className={`w-20 h-1 ${step >= 2 ? 'bg-secondary' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        <div className={`w-20 h-1 ${step >= 3 ? 'bg-secondary' : 'bg-gray-200'}`}></div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={() => setStep(2)}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" defaultValue={user?.name} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Shipping Address</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input type="tel" defaultValue={user?.phone} className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary" required />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                  Continue to Payment
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-xl font-bold text-slate-900">{formatPrice(total)}</p>
                </div>
              </div>

              {/* Payment Methods Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${paymentMethod === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <CreditCard className="w-4 h-4" /> Card
                </button>
                <button 
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${paymentMethod === 'upi' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <QrCode className="w-4 h-4" /> UPI / QR
                </button>
                <button 
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${paymentMethod === 'netbanking' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Landmark className="w-4 h-4" /> Netbanking
                </button>
              </div>

              <form onSubmit={handlePayment} className="min-h-[300px] flex flex-col justify-between">
                
                {/* Card Payment UI */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-semibold text-blue-900">Secured by Stripe</p>
                          <p className="text-xs text-blue-700">Your card details are encrypted.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-5 bg-white rounded border border-gray-200"></div>
                        <div className="w-8 h-5 bg-white rounded border border-gray-200"></div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Card Number</label>
                      <input type="text" placeholder="0000 0000 0000 0000" className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">CVC</label>
                        <input type="text" placeholder="123" className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                      <input type="text" placeholder="John Doe" className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary" required />
                    </div>
                  </div>
                )}

                {/* UPI Payment UI */}
                {paymentMethod === 'upi' && (
                  <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300 py-4">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=netsmart@upi&pn=NetSmart&am=${total}&cu=INR`} 
                        alt="Payment QR Code" 
                        className="w-48 h-48"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 mb-2">Scan with any UPI App</p>
                      <div className="flex justify-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> GPay</span>
                        <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> PhonePe</span>
                        <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Paytm</span>
                      </div>
                    </div>
                    <div className="w-full max-w-xs">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or enter UPI ID</span>
                        </div>
                      </div>
                      <input type="text" placeholder="username@upi" className="mt-3 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary text-center" />
                    </div>
                  </div>
                )}

                {/* Netbanking UI */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-6 animate-in fade-in duration-300 py-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bank</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank'].map(bank => (
                          <label key={bank} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-secondary hover:bg-blue-50 transition-colors">
                            <input type="radio" name="bank" className="text-secondary focus:ring-secondary" required />
                            <span className="ml-2 text-sm font-medium text-gray-900">{bank}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Other Banks</label>
                      <select className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary">
                        <option value="">Select Bank...</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                        <option value="yes">Yes Bank</option>
                        <option value="pnb">Punjab National Bank</option>
                        <option value="bob">Bank of Baroda</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-between items-center border-t pt-6">
                  <button type="button" onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-900">
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-secondary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center shadow-lg shadow-blue-500/20"
                  >
                    {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
