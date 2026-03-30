import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(form);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black">Qwapek Admin</h1>
          <p className="text-blue-100 text-sm mt-1">Panel administracyjny</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="label">Login</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="admin"
              className="input"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="label">Hasło</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="input pr-12"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !form.username || !form.password}
            className="btn-primary w-full py-3.5 text-base mt-2"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Logowanie...</>
            ) : (
              <><Lock size={18} /> Zaloguj się</>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Domyślne dane: admin / admin123
          </p>
        </form>
      </motion.div>
    </div>
  );
}
