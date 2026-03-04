import { useState, useEffect, useCallback, useRef } from "react";
import { Search, ShoppingCart, Star, AlertCircle, Filter, ChevronDown, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

const LIMIT = 12; // products per page

const CATEGORIES = [
  "all",
  "smartphones",
  "laptops",
  "fragrances",
  "skincare",
  "groceries",
  "home-decoration",
  "furniture",
  "tops",
  "womens-dresses",
  "womens-shoes",
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "womens-watches",
  "womens-bags",
  "womens-jewellery",
  "sunglasses",
  "automotive",
  "motorcycle",
  "lighting",
];

// Normalize DummyJSON product to match our app's shape
const normalizeProduct = (p) => ({
  id: p.id,
  title: p.title,
  price: p.price,
  image: p.thumbnail,
  category: p.category,
  rating: { rate: p.rating, count: p.stock },
  description: p.description,
});

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
        {product.category.split("-")[0]}
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 leading-snug">
        {product.title}
      </h3>
      <div className="flex items-center gap-1 mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              className={
                i < Math.round(product.rating?.rate || 4)
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-300 dark:text-gray-600"
              }
            />
          ))}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({product.rating?.count || 0})
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
        <span className="text-xl font-bold text-gray-900 dark:text-white">
          ${product.price.toFixed(2)}
        </span>
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
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const { addToCart, cartItems } = useCart();
  const cartIds = new Set(cartItems.map((i) => i.id));

  // Ref for the sentinel div at the bottom (infinite scroll trigger)
  const sentinelRef = useRef(null);
  const hasMore = products.length < total;

  // Build API URL based on filters
  const buildUrl = useCallback(
    (skip = 0) => {
      const base = "https://dummyjson.com/products";
      const params = new URLSearchParams({
        limit: LIMIT,
        skip,
        select: "id,title,price,thumbnail,category,rating,stock",
      });

      if (search) {
        return `${base}/search?q=${encodeURIComponent(search)}&${params}`;
      }
      if (category !== "all") {
        return `${base}/category/${category}?${params}`;
      }
      if (sortBy === "price-asc") {
        params.append("sortBy", "price");
        params.append("order", "asc");
      } else if (sortBy === "price-desc") {
        params.append("sortBy", "price");
        params.append("order", "desc");
      } else if (sortBy === "rating") {
        params.append("sortBy", "rating");
        params.append("order", "desc");
      }
      return `${base}?${params}`;
    },
    [search, category, sortBy]
  );

  // Initial fetch / re-fetch when filters change
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        setError(null);
        setProducts([]);
        setPage(0);
        const res = await fetch(buildUrl(0));
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products.map(normalizeProduct));
        setTotal(data.total);
        setPage(1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [buildUrl]);

  // Load more products (next page)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const skip = page * LIMIT;
      const res = await fetch(buildUrl(skip));
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts((prev) => [...prev, ...data.products.map(normalizeProduct)]);
      setPage((p) => p + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, buildUrl]);

  // IntersectionObserver — watches sentinel div at the bottom
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, loadMore]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset when category/sort changes
  const handleCategoryChange = (val) => {
    setCategory(val);
    setSearchInput("");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {loading
              ? "Loading..."
              : `Showing ${products.length} of ${total} products`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white text-sm transition"
            />
          </div>

          {/* Category */}
          <div className="relative">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="pl-9 pr-8 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-white text-sm appearance-none capitalize cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat === "all"
                    ? "All Categories"
                    : cat.replace(/-/g, " ")}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
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
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl mb-6 text-red-700 dark:text-red-400">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">
              {error}. Please refresh and try again.
            </p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {loading
            ? [...Array(LIMIT)].map((_, i) => <SkeletonCard key={i} />)
            : products.length === 0
            ? (
              <div className="col-span-full text-center py-16">
                <Search
                  size={48}
                  className="text-gray-300 dark:text-gray-600 mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )
            : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={addToCart}
                inCart={cartIds.has(product.id)}
              />
            ))}

          {/* Skeleton cards while loading more */}
          {loadingMore &&
            [...Array(4)].map((_, i) => <SkeletonCard key={`more-${i}`} />)}
        </div>

        {/* Sentinel div — triggers infinite scroll */}
        <div ref={sentinelRef} className="h-10 mt-6" />

        {/* Loading more spinner */}
        {loadingMore && (
          <div className="flex justify-center items-center gap-2 py-4 text-violet-600 dark:text-violet-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-medium">Loading more products...</span>
          </div>
        )}

        {/* All loaded message */}
        {!hasMore && !loading && products.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-500 dark:text-gray-400 shadow-sm">
              ✅ All {total} products loaded
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
