import { Link } from "react-router-dom";
import { ShoppingBag, ShoppingCart, User, TrendingUp, Package, Star, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import SessionTimer from "../components/SessionTimer";

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className={`${bg} rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all group`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <TrendingUp size={16} className="text-green-500 opacity-60" />
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

const QuickAction = ({ to, icon: Icon, label, desc, gradient }) => (
  <Link to={to} className={`group relative overflow-hidden rounded-2xl p-6 ${gradient} text-white hover:shadow-xl transition-all hover:scale-[1.02]`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
    <Icon size={32} className="mb-4 relative z-10" />
    <h3 className="text-xl font-bold mb-1 relative z-10">{label}</h3>
    <p className="text-white/80 text-sm relative z-10">{desc}</p>
    <div className="flex items-center gap-1 mt-4 text-white/90 text-sm font-medium relative z-10 group-hover:gap-2 transition-all">
      Go now <ArrowRight size={14} />
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { cartCount, cartTotal, cartItems } = useCart();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-1">{greeting} 👋</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, <span className="text-violet-600">{user?.name?.split(" ")[0]}</span>!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Here's what's happening with your account today.</p>
          </div>
          <SessionTimer />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={ShoppingCart} label="Items in Cart" value={cartCount} color="bg-violet-500" bg="bg-white dark:bg-gray-900" />
          <StatCard icon={TrendingUp} label="Cart Total" value={`$${cartTotal.toFixed(2)}`} color="bg-indigo-500" bg="bg-white dark:bg-gray-900" />
          <StatCard icon={Package} label="Unique Products" value={cartItems.length} color="bg-purple-500" bg="bg-white dark:bg-gray-900" />
          <StatCard icon={Star} label="Member Since" value="2025" color="bg-pink-500" bg="bg-white dark:bg-gray-900" />
        </div>

        {/* Quick Actions */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <QuickAction to="/products" icon={ShoppingBag} label="Browse Products" desc="Explore our full catalog of amazing products" gradient="bg-gradient-to-br from-violet-600 to-indigo-600" />
          <QuickAction to="/cart" icon={ShoppingCart} label="View Cart" desc={`You have ${cartCount} item${cartCount !== 1 ? "s" : ""} in your cart`} gradient="bg-gradient-to-br from-indigo-600 to-purple-600" />
          <QuickAction to="/profile" icon={User} label="My Profile" desc="Update your personal details & preferences" gradient="bg-gradient-to-br from-purple-600 to-pink-600" />
        </div>

        {/* Recent cart items preview */}
        {cartItems.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Cart Items</h2>
              <Link to="/cart" className="text-sm text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {cartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-contain rounded-lg bg-gray-100 dark:bg-gray-800 p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-violet-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {cartItems.length === 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-10 text-center">
            <ShoppingBag size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Start adding products to see them here</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition">
              Browse Products <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
