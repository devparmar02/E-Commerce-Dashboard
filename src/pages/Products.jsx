import { useState, useEffect, useCallback } from "react";
import { Search, ShoppingCart, Star, AlertCircle, Filter, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

const CATEGORIES = ["all", "electronics", "jewelery", "men's clothing", "women's clothing"];

const ProductCard = ({ product, onAdd, inCart }) => (
  <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:border-violet-200 dark:hover:border-violet-900 transition-all duration-300 flex flex-col">
    <div className="relative p-6 bg-gray-50 dark:bg-gray-800 flex items-center justify-center h-52">
      <img
        src={product.image}
        alt={product.title}
        className="h-40 w-full object-contain group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow text-gray-700 dark:text-gray-300 capitalize">
        {product.category.split(" ")[0]}
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-snug">{product.title}</h3>
      <div className="flex items-center gap-1 mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < Math.round(product.rating?.rate || 4) ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"} />
          ))}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">({product.rating?.count || 0})</span>
      </div>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
        <button
          onClick={() => onAdd(product)}
          disabled={inCart}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            inCart
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
              : "bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-violet-200 dark:hover:shadow-violet-900/30 active:scale-95"
          }`}
        >
          <ShoppingCart size={14} />
          {inCart ? "In Cart" : "Add"}
        </button>
      </div>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-200 dark:bg-gray-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-4" />
    </div>
  </div>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const { addToCart, cartItems } = useCart();

  const cartIds = new Set(cartItems.map((i) => i.id));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...products];
    if (category !== "all") result = result.filter((p) => p.category === category);
    if (search) result = result.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    setFiltered(result);
  }, [products, category, search, sortBy]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {loading ? "Loading..." : `Showing ${filtered.length} of ${products.length} products`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white text-sm transition"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-9 pr-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white text-sm appearance-none capitalize cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="capitalize">{cat === "all" ? "All Categories" : cat}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-4 pr-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white text-sm appearance-none cursor-pointer"
            >
              <option value="default">Default Sort</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-6 text-red-700 dark:text-red-400">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}. Please refresh and try again.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
            : filtered.length === 0
            ? (
              <div className="col-span-full text-center py-16">
                <Search size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )
            : filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
                inCart={cartIds.has(product.id)}
              />
            ))
          }
        </div>
      </main>
    </div>
  );
};

export default Products;
