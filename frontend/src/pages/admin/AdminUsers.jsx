import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Pencil, Trash2, X, Shield, ShieldCheck, Eye, Loader2 } from 'lucide-react';
import { authApi } from '../../api';

const ROLES = [
  { value: 'owner', label: 'Właściciel', desc: 'Pełne prawa + zarządzanie kontami', icon: ShieldCheck, cls: 'bg-red-100 text-red-700' },
  { value: 'trusted', label: 'Pracownik zaufany', desc: 'Dodawanie i edycja produktów', icon: Shield, cls: 'bg-amber-100 text-amber-700' },
  { value: 'worker', label: 'Pracownik', desc: 'Tylko odczyt zamówień', icon: Eye, cls: 'bg-blue-100 text-blue-700' },
];

function RoleBadge({ role }) {
  const r = ROLES.find((x) => x.value === role);
  return <span className={`badge ${r?.cls || 'bg-gray-100 text-gray-600'}`}>{r?.label || role}</span>;
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | { mode: 'add' } | { mode: 'edit', user }
  const [form, setForm] = useState({ username: '', password: '', role: 'worker' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await authApi.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setForm({ username: '', password: '', role: 'worker' });
    setError('');
    setModal({ mode: 'add' });
  };

  const openEdit = (user) => {
    setForm({ username: user.username, password: '', role: user.role });
    setError('');
    setModal({ mode: 'edit', user });
  };

  const handleSave = async () => {
    setError('');
    if (!form.username.trim()) return setError('Podaj nazwę użytkownika');
    if (modal.mode === 'add' && !form.password) return setError('Podaj hasło');
    if (form.password && form.password.length < 6) return setError('Hasło musi mieć min. 6 znaków');

    setSaving(true);
    try {
      if (modal.mode === 'add') {
        await authApi.createUser(form);
      } else {
        const payload = { username: form.username, role: form.role };
        if (form.password) payload.password = form.password;
        await authApi.updateUser(modal.user.id, payload);
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Błąd zapisu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Na pewno usunąć tego użytkownika?')) return;
    setDeleting(id);
    try {
      await authApi.deleteUser(id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Błąd usuwania');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Użytkownicy</h1>
          <p className="text-gray-500 text-sm">Zarządzanie kontami i uprawnieniami</p>
        </div>
        <button onClick={openAdd} className="btn-primary gap-2">
          <Plus size={18} />
          Nowy użytkownik
        </button>
      </div>

      {/* Roles legend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ROLES.map(({ value, label, desc, icon: Icon, cls }) => (
          <div key={value} className="card p-4 flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cls}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users list */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Users size={44} className="mx-auto mb-3 opacity-30" />
            <p>Brak użytkowników</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {['ID', 'Login', 'Rola', 'Utworzono', 'Akcje'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{user.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{user.username}</td>
                    <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                    <td className="px-6 py-4 text-gray-500">{new Date(user.created_at).toLocaleDateString('pl')}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(user)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edytuj">
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleting === user.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors disabled:opacity-50"
                          title="Usuń"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setModal(null)}
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">
                    {modal.mode === 'add' ? 'Nowy użytkownik' : 'Edytuj użytkownika'}
                  </h3>
                  <button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
                  )}
                  <div>
                    <label className="label">Login</label>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                      className="input"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="label">
                      Hasło {modal.mode === 'edit' && <span className="text-gray-400 font-normal">(pozostaw puste by nie zmieniać)</span>}
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                      className="input"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="label">Rola</label>
                    <div className="space-y-2">
                      {ROLES.map(({ value, label, desc, cls }) => (
                        <label
                          key={value}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            form.role === value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={value}
                            checked={form.role === value}
                            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                            className="sr-only"
                          />
                          <span className={`badge ${cls}`}>{label}</span>
                          <span className="text-xs text-gray-500">{desc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
                  <button onClick={() => setModal(null)} className="btn-secondary flex-1">Anuluj</button>
                  <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 gap-2">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                    {modal.mode === 'add' ? 'Utwórz' : 'Zapisz'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
