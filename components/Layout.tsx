import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { ShoppingCart, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { ChatWidget } from './ChatWidget';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, cart, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">N</div>
                <span className="font-bold text-xl tracking-tight text-slate-900">NetSmart</span>
              </Link>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                <Link to="/" className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${location.pathname === '/' ? 'border-secondary text-slate-900' : 'border-transparent text-gray-500 hover:text-slate-900 hover:border-gray-200'}`}>
                  Home
                </Link>
                <Link to="/shop" className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${location.pathname === '/shop' ? 'border-secondary text-slate-900' : 'border-transparent text-gray-500 hover:text-slate-900 hover:border-gray-200'}`}>
                  Shop
                </Link>
                {user && (
                   <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${location.pathname === '/dashboard' ? 'border-secondary text-slate-900' : 'border-transparent text-gray-500 hover:text-slate-900 hover:border-gray-200'}`}>
                   Dashboard
                 </Link>
                )}
                {user?.role === UserRole.ADMIN && (
                   <Link to="/admin" className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-200 ${location.pathname === '/admin' ? 'border-secondary text-slate-900' : 'border-transparent text-gray-500 hover:text-slate-900 hover:border-gray-200'}`}>
                   Admin
                 </Link>
                )}
              </div>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-6">
              {/* Cart Button */}
              <Link to="/cart" className="group flex items-center gap-2 text-slate-600 hover:text-secondary transition-colors relative">
                <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute top-1 right-0 inline-flex items-center justify-center h-4 w-4 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full ring-2 ring-white">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </Link>

              <div className="h-6 w-px bg-gray-200"></div>

              {user ? (
                <div className="flex items-center gap-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-bold text-slate-900 leading-tight">{user.name}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full mt-0.5">{user.role}</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold shadow-md border-2 border-white ring-1 ring-gray-100">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/login" 
                    className="text-gray-500 hover:text-gray-900 font-medium text-sm"
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
            
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/" className="block pl-3 pr-4 py-2 border-l-4 border-secondary text-base font-medium text-secondary bg-blue-50">Home</Link>
              <Link to="/shop" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300">Shop</Link>
              <Link to="/cart" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300">Cart ({cartItemCount})</Link>
              {user && <Link to="/dashboard" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300">Dashboard</Link>}
            </div>
            <div className="pt-4 pb-4 border-t border-gray-200">
               {user ? (
                 <div className="flex items-center px-4">
                   <div className="flex-shrink-0">
                     <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                       {user.name.charAt(0).toUpperCase()}
                     </div>
                   </div>
                   <div className="ml-3">
                     <div className="text-base font-medium text-gray-800">{user.name}</div>
                     <div className="text-sm font-medium text-gray-500 uppercase">{user.role}</div>
                   </div>
                   <button onClick={handleLogout} className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500">
                     <LogOut className="h-6 w-6" />
                   </button>
                 </div>
               ) : (
                 <div className="mt-3 space-y-2 px-4">
                   <Link to="/login" className="block w-full text-center rounded-lg border border-gray-300 px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Sign in</Link>
                   <Link to="/register" className="block w-full text-center rounded-lg bg-slate-900 px-4 py-2 text-base font-medium text-white hover:bg-slate-800">Create Account</Link>
                 </div>
               )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-8 md:order-2">
              <span className="text-gray-500 hover:text-gray-900 cursor-pointer text-sm font-medium">Privacy Policy</span>
              <span className="text-gray-500 hover:text-gray-900 cursor-pointer text-sm font-medium">Terms of Service</span>
              <span className="text-gray-500 hover:text-gray-900 cursor-pointer text-sm font-medium">Support</span>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                 <div className="w-6 h-6 bg-slate-200 rounded-md flex items-center justify-center text-slate-700 font-bold text-xs">N</div>
                 <span className="font-bold text-slate-700">NetSmart</span>
              </div>
              <p className="text-center md:text-left text-sm text-gray-400">
                &copy; 2026 NetSmart, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
};