import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package, BarChart3, CalendarDays, ShoppingBag, Wallet, ArrowUpRight, Loader2 } from 'lucide-react';
import { ordersApi } from '../../api';

export default function AdminFinancials() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getFinancials()
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-center text-gray-400 py-20">Nie udało się załadować danych</p>;
  }

  const fmt = (v) => v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł';

  const CARDS = [
    { label: 'Przychód (łącznie)', value: fmt(data.totalRevenue), icon: Wallet, color: 'from-emerald-500 to-teal-600', desc: 'Suma zrealizowanych zamówień' },
    { label: 'Ostatni tydzień', value: fmt(data.weekRevenue), icon: TrendingUp, color: 'from-blue-500 to-indigo-600', desc: `${data.weekOrders} zrealizowanych zamówień` },
    { label: 'Prognoza miesięczna', value: fmt(data.monthlyProjection), icon: ArrowUpRight, color: 'from-violet-500 to-purple-600', desc: 'Na podstawie tygodniowej sprzedaży' },
    { label: 'Ostatnie 30 dni', value: fmt(data.monthRevenue), icon: CalendarDays, color: 'from-amber-500 to-orange-600', desc: `${data.monthOrders} zrealizowanych zamówień` },
  ];

  const maxDaily = Math.max(...data.dailySales.map((d) => d.revenue), 1);

  const DAYS_PL = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Wartości</h1>
        <p className="text-gray-500 text-sm">Przychody, prognozy i wartość magazynu</p>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ label, value, icon: Icon, color, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${color} p-4`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/80">{label}</p>
                <Icon size={20} className="text-white/60" />
              </div>
              <p className="text-2xl font-extrabold text-white mt-2">{value}</p>
            </div>
            <div className="px-4 py-2 bg-gray-50">
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-blue-600" />
              <h2 className="font-bold text-gray-900">Sprzedaż dzienna (ostatnie 7 dni)</h2>
            </div>
          </div>
          <div className="p-6">
            {data.dailySales.length === 0 ? (
              <p className="text-center text-gray-400 py-8">Brak zrealizowanych zamówień w ostatnim tygodniu</p>
            ) : (
              <div className="space-y-3">
                {data.dailySales.map((day) => {
                  const d = new Date(day.day + 'T00:00:00');
                  const dayName = DAYS_PL[d.getDay()];
                  const dateStr = d.toLocaleDateString('pl', { day: 'numeric', month: 'short' });
                  const pct = (day.revenue / maxDaily) * 100;
                  return (
                    <div key={day.day} className="flex items-center gap-3">
                      <div className="w-20 flex-shrink-0 text-right">
                        <span className="text-xs font-semibold text-gray-500">{dayName}</span>
                        <span className="text-xs text-gray-400 ml-1">{dateStr}</span>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-7 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        />
                        <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold text-gray-700">
                          {fmt(day.revenue)} · {day.orders} zam.
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Stock value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-emerald-600" />
              <h2 className="font-bold text-gray-900">Wartość magazynu</h2>
            </div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-4">
              <Package size={36} className="text-emerald-600" />
            </div>
            <p className="text-4xl font-black text-gray-900 mb-1">{fmt(data.stockValue)}</p>
            <p className="text-sm text-gray-500 mb-6">
              Łączna wartość produktów dostępnych do sprzedaży
            </p>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{data.stockProducts}</p>
                <p className="text-xs text-gray-500">produktów</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{data.stockItems}</p>
                <p className="text-xs text-gray-500">sztuk łącznie</p>
              </div>
            </div>
          </div>

          {/* Projection info */}
          <div className="px-6 py-4 border-t border-gray-100 bg-violet-50">
            <div className="flex items-start gap-3">
              <ArrowUpRight size={18} className="text-violet-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-violet-900">Prognoza miesięczna</p>
                <p className="text-xs text-violet-700 mt-0.5">
                  Na podstawie sprzedaży z ostatniego tygodnia ({fmt(data.weekRevenue)}), 
                  prognozowany przychód w tym miesiącu to <strong>{fmt(data.monthlyProjection)}</strong>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
