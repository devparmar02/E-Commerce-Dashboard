import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const Cart = () => {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, clearCart, cartTotal } = useCart();

  const handleCheckout = () => {
    clearCart();
    toast.success("Order placed successfully! 🎉", { duration: 4000 });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-violet-100 dark:bg-violet-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-violet-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Looks like you haven't added anything yet. Explore our products and find something you love!
            </p>
            <Link to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-violet-200 dark:hover:shadow-violet-900/40">
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const shipping = cartTotal > 50 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 font-medium hover:underline transition">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex gap-5 hover:shadow-md transition-all">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center p-2">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 capitalize mb-3">{item.category}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                      <button onClick={() => decreaseQty(item.id)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 transition-all shadow-sm">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                      <button onClick={() => increaseQty(item.id)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 transition-all shadow-sm">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeFromCart(item.id)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">${item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-green-600" : "text-gray-900 dark:text-white"}`}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tax (8%)</span>
                  <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-xs text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 p-2 rounded-lg">
                    Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-violet-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo */}
              <div className="flex gap-2 mb-5">
                <div className="relative flex-1">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Promo code"
                    className="w-full pl-8 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  Apply
                </button>
              </div>

              <button onClick={handleCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-violet-200 dark:hover:shadow-violet-900/40 active:scale-[0.98] flex items-center justify-center gap-2">
                Place Order <ArrowRight size={16} />
              </button>

              <Link to="/products"
                className="mt-3 w-full py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2 text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
