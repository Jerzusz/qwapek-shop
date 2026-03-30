import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Tags, Check, X, Loader2 } from 'lucide-react';
import { categoriesApi } from '../../api';
import { ICON_MAP, DEFAULT_ICON, ICON_OPTIONS, COLOR_MAP, COLOR_OPTIONS } from '../../utils/categoryUtils';

const EMPTY_FORM = { name: '', icon: 'Package', color: 'blue' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.getAll();
      setCategories(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setEditId(cat.id);
    setForm({ name: cat.name, icon: cat.icon || 'Package', color: cat.color || 'gray' });
    setError('');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditId(null);
    setError('');
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Podaj nazwę kategorii'); return; }
    setSaving(true);
    setError('');
    try {
      if (editId) {
        await categoriesApi.update(editId, form);
      } else {
        await categoriesApi.create(form);
      }
      await fetchCategories();
      setShowForm(false);
      setEditId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Błąd zapisu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await categoriesApi.delete(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Błąd usuwania');
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const PreviewIcon = ICON_MAP[form.icon] || DEFAULT_ICON;
  const previewColor = COLOR_MAP[form.color] || COLOR_MAP.gray;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategorie</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {loading ? '...' : `${categories.length} kategorii`}
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary gap-2 flex items-center">
          <Plus size={18} />
          Dodaj kategorię
        </button>
      </div>

      {/* Add / Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="card mb-6 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              {editId ? 'Edytuj kategorię' : 'Nowa kategoria'}
            </h2>

            {/* Live preview */}
            <div className="flex items-center gap-3 mb-5 p-3 bg-gray-50 rounded-xl w-fit">
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${previewColor.bg} ${previewColor.text}`}>
                <PreviewIcon size={20} />
              </span>
              <span className="text-sm font-medium text-gray-700">
                {form.name || 'Podgląd nazwy'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nazwa kategorii <span className="text-red-500">*</span>
                </label>
                <input
                  className="input w-full"
                  placeholder="np. Elektronika"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              {/* Icon picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ikona</label>
                <div className="flex flex-wrap gap-1.5">
                  {ICON_OPTIONS.map(({ key }) => {
                    const Icon = ICON_MAP[key] || DEFAULT_ICON;
                    return (
                      <button
                        key={key}
                        type="button"
                        title={key}
                        onClick={() => setForm(f => ({ ...f, icon: key }))}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          form.icon === key
                            ? 'bg-blue-600 text-white shadow-sm scale-110'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Icon size={15} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Color picker */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kolor</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(({ key, label, swatch }) => (
                  <button
                    key={key}
                    type="button"
                    title={label}
                    onClick={() => setForm(f => ({ ...f, color: key }))}
                    className={`w-7 h-7 rounded-full ${swatch} transition-all ${
                      form.color === key
                        ? 'ring-2 ring-offset-2 ring-gray-500 scale-110'
                        : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary gap-2 flex items-center"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {editId ? 'Zapisz zmiany' : 'Dodaj kategorię'}
              </button>
              <button onClick={handleCancel} className="btn-secondary">Anuluj</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="card h-16 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="card text-center py-16 text-gray-400">
          <Tags size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium text-gray-600">Brak kategorii</p>
          <p className="text-sm mt-1">Dodaj pierwszą kategorię klikając przycisk powyżej</p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || DEFAULT_ICON;
            const cs = COLOR_MAP[cat.color] || COLOR_MAP.gray;
            return (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 px-5 py-4"
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cs.bg} ${cs.text}`}>
                  <Icon size={18} />
                </span>
                <span className="flex-1 font-medium text-gray-800">{cat.name}</span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    title="Edytuj"
                  >
                    <Pencil size={16} />
                  </button>

                  {confirmDelete === cat.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={deletingId === cat.id}
                        className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-60"
                      >
                        {deletingId === cat.id ? '...' : 'Potwierdź'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(cat.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Usuń"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
