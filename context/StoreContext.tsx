import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, UserRole, ApprovalStatus } from '../types';
import { MOCK_USERS, MOCK_PRODUCTS } from '../constants';

interface StoreContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  users: User[]; // For admin
  login: (email: string, pass: string) => Promise<boolean>;
  register: (user: Partial<User>) => Promise<void>;
  logout: () => void;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (shippingAddress: string) => Promise<void>;
  updateUserStatus: (userId: string, status: ApprovalStatus) => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Hydrate from local storage in a real app
  useEffect(() => {
    const savedUser = localStorage.getItem('netsmart_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.password === pass);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('netsmart_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('netsmart_user');
    setCart([]);
  };

  const register = async (newUser: Partial<User>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const createdUser: User = {
      id,
      name: newUser.name || '',
      email: newUser.email || '',
      role: newUser.role || UserRole.CUSTOMER,
      password: newUser.password,
      approvalStatus: newUser.role === UserRole.RETAILER ? ApprovalStatus.PENDING : ApprovalStatus.APPROVED,
      ...newUser
    };
    setUsers([...users, createdUser]);
    // Auto login if customer
    if (createdUser.role === UserRole.CUSTOMER) {
      setUser(createdUser);
      localStorage.setItem('netsmart_user', JSON.stringify(createdUser));
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (shippingAddress: string) => {
    if (!user) return;
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      items: [...cart],
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      date: new Date().toISOString(),
      shippingAddress
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  // Admin Actions
  const updateUserStatus = (userId: string, status: ApprovalStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, approvalStatus: status } : u));
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <StoreContext.Provider value={{
      user, products, cart, orders, users,
      login, register, logout,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, updateUserStatus, addProduct, updateProduct, deleteProduct, updateOrderStatus
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};