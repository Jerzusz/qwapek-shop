import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { productsApi, categoriesApi } from '../../api';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { ICON_MAP, DEFAULT_ICON } from '../../utils/categoryUtils';

const ALL = { name: 'Wszystkie', icon: 'LayoutGrid' };

const LIMIT = 12;

export default function ProductGrid() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [apiCategories, setApiCategories] = useState([]);

  const category = params.get('category') || '';
  const searchQ = params.get('search') || '';
  const [search, setSearch] = useState(searchQ);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productsApi.getAll({
        ...(category && { category }),
        ...(search && { search }),
        page,
        limit: LIMIT,
      });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setApiCategories(data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setSearch(searchQ);
    setPage(1);
  }, [category, searchQ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(location.search);
    if (search) newParams.set('search', search);
    else newParams.delete('search');
    newParams.delete('page');
    navigate(`/?${newParams.toString()}`);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    navigate('/');
    setPage(1);
  };

  const totalPages = Math.ceil(total / LIMIT);
  const hasFilters = category || search;

  return (
    <div>
      {/* Search + filter bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Szukaj produktów..."
              className="input pl-10 pr-4"
            />
          </div>
          <button type="submit" className="btn-primary px-5">Szukaj</button>
        </form>

        {hasFilters && (
          <button onClick={clearFilters} className="btn-secondary gap-1.5 flex-shrink-0">
            <X size={16} />
            Wyczyść
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {[ALL, ...apiCategories].map((cat) => {
          const Icon = ICON_MAP[cat.icon] || DEFAULT_ICON;
          const isActive = (category === cat.name) || (!category && cat.name === 'Wszystkie');
          return (
            <button
              key={cat.name}
              onClick={() => {
                const newParams = new URLSearchParams();
                if (cat.name !== 'Wszystkie') newParams.set('category', cat.name);
                navigate(`/?${newParams.toString()}`);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <Icon size={14} />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? 'Ładowanie...' : `${total} ${total === 1 ? 'produkt' : total < 5 ? 'produkty' : 'produktów'}`}
          {category && <span className="font-medium text-gray-700"> w kategorii „{category}"</span>}
          {search && <span className="font-medium text-gray-700"> dla „{search}"</span>}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2 mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-gray-400"
        >
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-lg font-medium text-gray-600">Brak produktów</p>
          <p className="text-sm mt-1">Spróbuj zmienić kryteria wyszukiwania</p>
          <button onClick={clearFilters} className="btn-primary mt-4">
            Pokaż wszystkie
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary btn-sm"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-400 px-1">…</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                        p === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary btn-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Product modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
