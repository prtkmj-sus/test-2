import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, User as UserIcon, MapPin, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, orders } = useStore();
  const myOrders = orders.filter(o => o.userId === user?.id);

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  if (!user) return <div>Please login</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your account and view order history.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gray-100 p-3 rounded-full">
                <UserIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase">Email</label>
                <p className="text-gray-900">{user.email}</p>
              </div>
              {user.businessName && (
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Business</label>
                  <p className="text-gray-900">{user.businessName}</p>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase">Approval Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                  user.approvalStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.approvalStatus?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" /> Recent Orders
            </h2>
            
            {myOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet.</p>
            ) : (
              <div className="space-y-6">
                {myOrders.map(order => (
                  <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-gray-900">Order #{order.id}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                           <Clock className="w-3 h-3" /> {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase">
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.quantity}x {item.name}</span>
                          <span className="font-medium text-gray-900">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t pt-3 flex justify-between items-center">
                       <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" /> {order.shippingAddress}
                       </div>
                       <p className="font-bold text-gray-900 text-lg">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
