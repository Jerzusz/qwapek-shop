import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { ordersApi } from '../../api';

const STATUSES = [
  { value: 'all', label: 'Wszystkie' },
  { value: 'new', label: 'Nowe', cls: 'bg-blue-100 text-blue-700' },
  { value: 'processing', label: 'W realizacji', cls: 'bg-amber-100 text-amber-700' },
  { value: 'shipped', label: 'Wysłane', cls: 'bg-green-100 text-green-700' },
  { value: 'completed', label: 'Zrealizowane', cls: 'bg-emerald-100 text-emerald-700' },
];

function StatusBadge({ status }) {
  const s = STATUSES.find((x) => x.value === status);
  return <span className={`badge ${s?.cls || 'bg-gray-100 text-gray-600'}`}>{s?.label || status}</span>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await ordersApi.getAll({
        status: filter !== 'all' ? filter : undefined,
        page,
        limit: 15,
      });
      setOrders(data.orders);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(orderId);
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Zamówienia</h1>
          <p className="text-gray-500 text-sm">{total} zamówień łącznie</p>
        </div>
        <button onClick={load} className="btn-secondary gap-2">
          <RefreshCw size={16} />
          Odśwież
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { setFilter(value); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === value ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ShoppingBag size={44} className="mx-auto mb-3 opacity-30" />
            <p>Brak zamówień</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map((order) => (
              <div key={order.id}>
                {/* Row */}
                <div
                  className="px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      {order.order_number}
                    </span>
                    <span className="font-semibold text-gray-900">{order.name}</span>
                    <span className="text-sm text-gray-500">{order.email}</span>
                    <span className="font-bold text-gray-900 ml-auto">{order.total.toFixed(2)} zł</span>
                    <StatusBadge status={order.status} />
                    <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('pl')}</span>
                    {expanded === order.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {expanded === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 bg-gray-50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                          {/* Customer info */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Dane klienta</h4>
                            <div className="text-sm space-y-1">
                              <p><span className="text-gray-500">Telefon:</span> <span className="font-medium">{order.phone}</span></p>
                              <p><span className="text-gray-500">Adres:</span> <span className="font-medium">{order.address}, {order.postal_code} {order.city}</span></p>
                              {order.notes && <p><span className="text-gray-500">Uwagi:</span> <span className="font-medium">{order.notes}</span></p>}
                            </div>
                          </div>

                          {/* Items */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Produkty</h4>
                            <ul className="text-sm space-y-1">
                              {order.items.map((item, i) => (
                                <li key={i} className="flex justify-between">
                                  <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)} zł</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Status update */}
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-700">Zmień status:</span>
                          <div className="flex gap-2">
                            {['new', 'processing', 'shipped', 'completed'].map((s) => (
                              <button
                                key={s}
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, s); }}
                                disabled={order.status === s || updating === order.id}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                                  order.status === s ? STATUSES.find(x => x.value === s)?.cls + ' ring-2 ring-current ring-offset-1' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
                                }`}
                              >
                                {STATUSES.find(x => x.value === s)?.label}
                              </button>
                            ))}
                          </div>
                          {updating === order.id && <span className="text-xs text-gray-400">Zapisywanie...</span>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
    </div>
  );
}
