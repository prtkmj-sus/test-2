import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole, ApprovalStatus, Order, Product } from '../types';
import { Users, Package, Check, X, Shield, Plus, DollarSign, ShoppingBag, TrendingUp, Truck, Edit2, Trash2, Save } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, products, orders, updateUserStatus, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'users'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  // Add Product State
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', price: '', description: '', stock: '', image: ''
  });

  // Edit Product State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // Filter for pending retailers - This ensures every new retailer registration appears here
  const pendingRetailers = users.filter(u => u.role === UserRole.RETAILER && u.approvalStatus === ApprovalStatus.PENDING);
  const allRetailers = users.filter(u => u.role === UserRole.RETAILER);
  const customers = users.filter(u => u.role === UserRole.CUSTOMER);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.stock < 10);

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      stock: parseInt(newProduct.stock),
      image: newProduct.image || 'https://images.unsplash.com/photo-1544197150-b99a580bbcbf?q=80&w=1000&auto=format&fit=crop',
      specs: {}
    });
    setShowAddProduct(false);
    setNewProduct({ name: '', category: '', price: '', description: '', stock: '', image: '' });
  };

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId) {
      updateProduct(editingId, editForm);
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-slate-900 p-3 rounded-lg text-white">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-500">Manage your store, products, and orders.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'products' ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          Product Inventory
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-slate-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
        >
          User Management
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => setActiveTab('orders')}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
              <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-green-600"/></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
            <p className="text-xs text-green-600 mt-2 flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +12% from last month</p>
          </div>

          <div 
            onClick={() => setActiveTab('orders')}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
              <div className="p-2 bg-blue-50 rounded-lg"><ShoppingBag className="w-5 h-5 text-blue-600"/></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-xs text-gray-500 mt-2">All time orders</p>
          </div>

          <div 
            onClick={() => setActiveTab('products')}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Active Products</h3>
              <div className="p-2 bg-purple-50 rounded-lg"><Package className="w-5 h-5 text-purple-600"/></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            <p className="text-xs text-gray-500 mt-2">{lowStockProducts.length} items low on stock</p>
          </div>

          <div 
            onClick={() => setActiveTab('users')}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all hover:-translate-y-1"
          >
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-gray-500 text-sm font-medium">Retailers</h3>
               <div className="p-2 bg-orange-50 rounded-lg"><Users className="w-5 h-5 text-orange-600"/></div>
             </div>
             <p className="text-3xl font-bold text-gray-900">{allRetailers.length}</p>
             <p className="text-xs text-orange-600 mt-2">{pendingRetailers.length} pending approval</p>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
          </div>
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shippingAddress.substring(0, 20)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-8">
          {/* Pending Retailers Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-yellow-500" /> Pending Retailer Applications
              {pendingRetailers.length > 0 && <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{pendingRetailers.length} New</span>}
            </h2>
            
            {pendingRetailers.length === 0 ? (
              <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg">No pending applications at the moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingRetailers.map(retailer => (
                      <tr key={retailer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{retailer.businessName}</div>
                          <div className="text-sm text-gray-500">{retailer.address}</div>
                          {retailer.id.includes('random') && <div className="text-xs text-blue-500 mt-1">Newly Registered</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{retailer.name}</div>
                          <div className="text-sm text-gray-500">{retailer.email}</div>
                          <div className="text-sm text-gray-500">{retailer.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                          <button 
                            onClick={() => updateUserStatus(retailer.id, ApprovalStatus.APPROVED)}
                            className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-4 h-4" /> Approve
                          </button>
                          <button 
                             onClick={() => updateUserStatus(retailer.id, ApprovalStatus.REJECTED)}
                             className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Retailers Directory</h2>
              <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {allRetailers.map(r => (
                  <li key={r.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{r.businessName}</p>
                      <p className="text-sm text-gray-500">{r.name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      r.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                      r.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {r.approvalStatus}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Registered Customers</h2>
              <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {customers.map(c => (
                  <li key={c.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-sm text-gray-500">{c.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">
                      User
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <Package className="w-5 h-5" /> Inventory Management
             </h2>
             <button 
               onClick={() => setShowAddProduct(!showAddProduct)}
               className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-600 transition-colors"
             >
               <Plus className="w-4 h-4" /> Add Product
             </button>
           </div>

           {showAddProduct && (
             <form onSubmit={handleAddProduct} className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="grid grid-cols-2 gap-4 mb-4">
                 <input placeholder="Product Name" className="p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                 <input placeholder="Category" className="p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                 <input placeholder="Price" type="number" className="p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                 <input placeholder="Stock" type="number" className="p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                 <input placeholder="Image URL (optional)" className="p-3 border border-gray-200 rounded-lg col-span-2 bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                 <textarea placeholder="Description" className="p-3 border border-gray-200 rounded-lg col-span-2 bg-white focus:outline-none focus:ring-2 focus:ring-secondary/50" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
               </div>
               <div className="flex justify-end gap-3">
                 <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900">Cancel</button>
                 <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800">Save Product</button>
               </div>
             </form>
           )}

           <div className="grid grid-cols-1 gap-4">
             {products.map(product => (
               <div key={product.id} className="p-4 border border-gray-100 rounded-xl bg-white hover:border-gray-200 transition-colors">
                 {editingId === product.id ? (
                   <div className="space-y-4">
                     <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                         <img src={editForm.image || product.image} alt={product.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 grid grid-cols-2 gap-4">
                         <div className="col-span-2">
                           <label className="text-xs font-semibold text-gray-500 uppercase">Product Name</label>
                           <input 
                             value={editForm.name} 
                             onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                             className="w-full p-2 border rounded-lg"
                           />
                         </div>
                         <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Price (₹)</label>
                            <input 
                              type="number"
                              value={editForm.price} 
                              onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                              className="w-full p-2 border rounded-lg"
                            />
                         </div>
                         <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase">Stock</label>
                            <input 
                              type="number"
                              value={editForm.stock} 
                              onChange={(e) => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                              className="w-full p-2 border rounded-lg"
                            />
                         </div>
                       </div>
                     </div>
                     <div className="flex justify-end gap-2 mt-2">
                       <button onClick={cancelEditing} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                       <button onClick={saveEdit} className="px-3 py-1 text-sm bg-green-600 text-white hover:bg-green-700 rounded flex items-center gap-1">
                         <Save className="w-3 h-3" /> Save Changes
                       </button>
                     </div>
                   </div>
                 ) : (
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                         <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                       </div>
                       <div>
                         <p className="font-bold text-gray-900">{product.name}</p>
                         <p className="text-sm text-gray-500">{product.category} • <span className={`${product.stock < 10 ? 'text-red-500 font-medium' : ''}`}>Stock: {product.stock}</span></p>
                       </div>
                     </div>
                     <div className="flex items-center gap-4 text-right">
                       <span className="block font-bold text-gray-900">{formatPrice(product.price)}</span>
                       <div className="flex gap-2">
                         <button 
                           onClick={() => startEditing(product)}
                           className="p-2 text-secondary hover:bg-blue-50 rounded-lg transition-colors"
                           title="Edit Product"
                         >
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDeleteProduct(product.id)}
                           className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                           title="Delete Product"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   </div>
                 )}
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};