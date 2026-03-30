import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, ShieldCheck, Truck, RefreshCw, Zap, Shirt, Gamepad2, Sparkles, Sofa, Wrench } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';

const FEATURES = [
  { icon: Truck, title: 'Dostawa 24–48h', desc: 'Szybka wysyłka kurierem' },
  { icon: ShieldCheck, title: 'Gwarancja jakości', desc: 'Sprawdzone produkty' },
  { icon: RefreshCw, title: 'Zwroty 14 dni', desc: 'Bez pytań i problemów' },
  { icon: Package, title: 'Palety zwrotów', desc: 'Niespotykane ceny' },
];

const CATEGORY_HIGHLIGHTS = [
  { name: 'Elektronika', icon: Zap, gradient: 'from-blue-500 to-indigo-600', emoji: '⚡' },
  { name: 'Ubrania', icon: Shirt, gradient: 'from-pink-500 to-rose-600', emoji: '👕' },
  { name: 'Zabawki', icon: Gamepad2, gradient: 'from-amber-400 to-orange-500', emoji: '🎮' },
  { name: 'Środki czystości', icon: Sparkles, gradient: 'from-emerald-400 to-teal-600', emoji: '✨' },
  { name: 'Akcesoria meblowe', icon: Sofa, gradient: 'from-violet-500 to-purple-700', emoji: '🛋️' },
  { name: 'Narzędzia', icon: Wrench, gradient: 'from-red-500 to-red-700', emoji: '🔧' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Package size={15} className="text-blue-300" />
              Palety zwrotów · Mix kategorii
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-5">
              Wyjątkowe produkty<br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                w niesamowitych cenach
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              Elektronika, ubrania, zabawki, narzędzia i wiele więcej — produkty z palet zwrotów najwyższej jakości.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#products" className="btn bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 text-base shadow-lg shadow-blue-900/30">
                Przeglądaj produkty
                <ArrowRight size={18} />
              </a>
              <Link to="/kontakt" className="btn border border-white/30 text-white hover:bg-white/10 px-8 py-4 text-base backdrop-blur-sm">
                Kontakt
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category highlights */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategorie</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORY_HIGHLIGHTS.map(({ name, gradient, emoji }, i) => (
            <motion.a
              key={name}
              href={`/?category=${encodeURIComponent(name)}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`bg-gradient-to-br ${gradient} rounded-2xl p-4 text-center text-white hover:shadow-lg transition-shadow`}
            >
              <div className="text-3xl mb-1">{emoji}</div>
              <p className="text-xs font-semibold leading-tight">{name}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Main products section — 3 column layout on desktop */}
      <section id="products" className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex gap-6">
          {/* Left decorative strip (desktop only) */}
          <aside className="hidden xl:flex flex-col gap-3 w-36 flex-shrink-0 pt-14">
            {CATEGORY_HIGHLIGHTS.map(({ name, gradient, emoji }, i) => (
              <motion.a
                key={name}
                href={`/?category=${encodeURIComponent(name)}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 4 }}
                className={`bg-gradient-to-br ${gradient} rounded-2xl p-3 text-white flex flex-col items-center text-center gap-1 hover:shadow-md transition-shadow`}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-semibold leading-tight">{name}</span>
              </motion.a>
            ))}
          </aside>

          {/* Products grid - main content */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nasze produkty</h2>
            <ProductGrid />
          </div>

          {/* Right info strip (desktop only) */}
          <aside className="hidden xl:flex flex-col gap-3 w-36 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white text-center"
            >
              <Package size={28} className="mx-auto mb-2 text-blue-200" />
              <p className="text-xs font-bold">Nowe palety</p>
              <p className="text-xs text-blue-200 mt-1">co tydzień</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white text-center"
            >
              <ShieldCheck size={28} className="mx-auto mb-2 text-emerald-200" />
              <p className="text-xs font-bold">100% pewność</p>
              <p className="text-xs text-emerald-200 mt-1">zwrot 14 dni</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white text-center"
            >
              <Truck size={28} className="mx-auto mb-2 text-amber-200" />
              <p className="text-xs font-bold">Dostawa</p>
              <p className="text-xs text-amber-200 mt-1">24–48 godzin</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-32 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-4 text-white text-center"
            >
              <RefreshCw size={28} className="mx-auto mb-2 text-rose-200" />
              <p className="text-xs font-bold">Oszczędności</p>
              <p className="text-xs text-rose-200 mt-1">do 70% taniej</p>
            </motion.div>
          </aside>
        </div>
      </section>
    </div>
  );
}
