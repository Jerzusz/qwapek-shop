import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, MessageSquare, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { productsApi, ordersApi, contactApi } from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, messages: 0, revenue: 0, unread: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, oRes, mRes, sRes] = await Promise.all([
          productsApi.getAll({ limit: 1 }),
          ordersApi.getAll({ limit: 5 }),
          contactApi.getMessages({ limit: 1 }),
          ordersApi.getStats(),
        ]);
        setStats({
          products: pRes.data.total,
          orders: oRes.data.total,
          messages: mRes.data.total,
          revenue: sRes.data.revenue,
          unread: mRes.data.unread,
        });
        setRecentOrders(oRes.data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const STATUS = { new: { label: 'Nowe', cls: 'bg-blue-100 text-blue-700' }, processing: { label: 'W realizacji', cls: 'bg-amber-100 text-amber-700' }, shipped: { label: 'Wysłane', cls: 'bg-green-100 text-green-700' }, completed: { label: 'Zrealizowane', cls: 'bg-emerald-100 text-emerald-700' } };

  const STAT_CARDS = [
    { label: 'Produkty', value: stats.products, icon: Package, color: 'bg-blue-50 text-blue-600', link: '/admin/produkty' },
    { label: 'Zamówienia', value: stats.orders, icon: ShoppingBag, color: 'bg-violet-50 text-violet-600', link: '/admin/zamowienia' },
    { label: 'Wiadomości', value: stats.messages, icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600', link: '/admin/wiadomosci', badge: stats.unread },
    { label: 'Przychód (zrealizowane)', value: `${stats.revenue.toFixed(2)} zł`, icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Witaj z powrotem w panelu Qwapek</p>
        </div>
        <Link to="/admin/produkty/nowy" className="btn-primary gap-2">
          <Plus size={18} />
          Nowy produkt
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, link, badge }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            {link ? (
              <Link to={link} className="block card p-5 hover:shadow-card-hover transition-shadow">
                <StatCard Icon={Icon} color={color} label={label} value={value} badge={badge} />
              </Link>
            ) : (
              <div className="card p-5">
                <StatCard Icon={Icon} color={color} label={label} value={value} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Ostatnie zamówienia</h2>
          <Link to="/admin/zamowienia" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium">
            Wszystkie <ArrowRight size={14} />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
            <p>Brak zamówień</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['Numer', 'Klient', 'Kwota', 'Status', 'Data'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-blue-600">{order.order_number}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{order.name}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{order.total.toFixed(2)} zł</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${STATUS[order.status]?.cls || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString('pl')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ Icon, color, label, value, badge }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="relative">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon size={22} />
        </div>
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
    </div>
  );
}
