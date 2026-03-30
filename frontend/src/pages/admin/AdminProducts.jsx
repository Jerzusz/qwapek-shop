import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Package, Search, AlertTriangle, X } from 'lucide-react';
import { productsApi } from '../../api';

const CATEGORY_COLORS = {
  Elektronika: 'bg-blue-100 text-blue-700',
  Ubrania: 'bg-pink-100 text-pink-700',
  Zabawki: 'bg-amber-100 text-amber-700',
  'Środki czystości': 'bg-emerald-100 text-emerald-700',
  'Akcesoria meblowe': 'bg-violet-100 text-violet-700',
  Narzędzia: 'bg-red-100 text-red-700',
  Inne: 'bg-gray-100 text-gray-600',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productsApi.getAll({ search: search || undefined, page, limit: 15 });
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await productsApi.delete(id);
      setConfirmDelete(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Produkty</h1>
          <p className="text-gray-500 text-sm">{total} produktów łącznie</p>
        </div>
        <Link to="/admin/produkty/nowy" className="btn-primary gap-2">
          <Plus size={18} />
          Dodaj produkt
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Szukaj produktów..."
          className="input pl-10"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Package size={44} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Brak produktów</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Produkt', 'Kategoria', 'Cena', 'Ilość', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {products.map((p) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Package size={18} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate max-w-[200px]">{p.name}</p>
                            {p.is_new && <span className="text-xs text-blue-600 font-medium">Nowość</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${CATEGORY_COLORS[p.category] || 'bg-gray-100 text-gray-600'}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-gray-900">{p.price.toFixed(2)} zł</td>
                      <td className="px-5 py-4">
                        <span className={`font-semibold ${p.quantity === 0 ? 'text-red-500' : p.quantity <= 2 ? 'text-orange-500' : 'text-gray-900'}`}>
                          {p.quantity} szt.
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${
                          p.status === 'available' ? 'bg-green-100 text-green-700' :
                          p.status === 'out_of_stock' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {p.status === 'available' ? 'Dostępny' : p.status === 'out_of_stock' ? 'Brak' : p.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/produkty/edytuj/${p.id}`}
                            className="p-2 rounded-xl hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(p)}
                            className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${p === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900">Usuń produkt</h3>
              </div>
              <p className="text-gray-600 text-sm mb-5">
                Czy na pewno chcesz usunąć <strong>{confirmDelete.name}</strong>? Tej operacji nie można cofnąć.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1">Anuluj</button>
                <button onClick={() => handleDelete(confirmDelete.id)} disabled={deleting} className="btn-danger flex-1">
                  {deleting ? 'Usuwanie...' : 'Usuń'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
