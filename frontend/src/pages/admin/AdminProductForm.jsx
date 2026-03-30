import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Loader2, Package, CheckCircle } from 'lucide-react';
import { productsApi, categoriesApi } from '../../api';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileRef = useRef();

  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', quantity: '', status: 'available', is_new: false });
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [loadingForm, setLoadingForm] = useState(isEdit);

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => {
      setCategories(data);
      if (!isEdit && data.length > 0) setForm(f => ({ ...f, category: f.category || data[0].name }));
    }).catch(() => {});
  }, [isEdit]);

  useEffect(() => {
    if (isEdit) {
      productsApi.getById(id)
        .then(({ data }) => {
          setForm({
            name: data.name,
            description: data.description || '',
            category: data.category,
            price: data.price.toString(),
            quantity: data.quantity.toString(),
            status: data.status,
            is_new: Boolean(data.is_new),
          });
          setExistingImages(data.images || []);
        })
        .catch(() => navigate('/admin/produkty'))
        .finally(() => setLoadingForm(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setNewFiles((prev) => [...prev, ...valid]);
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => setNewPreviews((prev) => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeExisting = (img) => setExistingImages((prev) => prev.filter((i) => i !== img));
  const removeNew = (idx) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Podaj nazwę produktu';
    if (!form.category) errs.category = 'Wybierz kategorię';
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) errs.price = 'Podaj prawidłową cenę';
    if (form.quantity !== '' && (isNaN(parseInt(form.quantity)) || parseInt(form.quantity) < 0)) errs.quantity = 'Podaj prawidłową ilość';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    try {
      const fd = new FormData();
      fd.append('name', form.name.trim());
      fd.append('description', form.description.trim());
      fd.append('category', form.category);
      fd.append('price', form.price);
      fd.append('quantity', form.quantity || '0');
      fd.append('status', form.status);
      fd.append('is_new', form.is_new ? 'true' : 'false');
      existingImages.forEach((img) => fd.append('keep_images', img));
      newFiles.forEach((file) => fd.append('images', file));

      if (isEdit) {
        await productsApi.update(id, fd);
      } else {
        await productsApi.create(fd);
      }
      setStatus('success');
      setTimeout(() => navigate('/admin/produkty'), 1200);
    } catch (err) {
      setErrors({ _general: err.response?.data?.message || 'Błąd zapisu' });
      setStatus('idle');
    }
  };

  if (loadingForm) {
    return <div className="flex justify-center pt-20"><Loader2 size={32} className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/produkty')} className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{isEdit ? 'Edytuj produkt' : 'Nowy produkt'}</h1>
        </div>
      </div>

      {status === 'success' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-2xl">
          <CheckCircle size={20} />
          Produkt zapisany! Przekierowuję...
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {errors._general && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{errors._general}</div>
        )}

        {/* Images */}
        <div>
          <label className="label">Zdjęcia produktu</label>
          <div
            className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
          >
            <Upload size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Przeciągnij zdjęcia lub <span className="text-blue-600 font-medium">wybierz pliki</span></p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP – max 10MB każde</p>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </div>

          {/* Preview grid */}
          {(existingImages.length > 0 || newPreviews.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {existingImages.map((img) => (
                <div key={img} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExisting(img)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group border-2 border-blue-400">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNew(i)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <X size={16} className="text-white" />
                  </button>
                  <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-xs text-center py-0.5">Nowe</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="label">Nazwa produktu *</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="np. Smartwatch Samsung Galaxy Watch 5" className={`input ${errors.name ? 'border-red-400' : ''}`} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label">Opis</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Opis produktu, stan, co jest w zestawie..." className="input resize-none" />
        </div>

        {/* Category + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Kategoria *</label>
            <select name="category" value={form.category} onChange={handleChange} className={`input ${errors.category ? 'border-red-400' : ''}`}>
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              <option value="available">Dostępny</option>
              <option value="out_of_stock">Brak w magazynie</option>
            </select>
          </div>
        </div>

        {/* Price + Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Cena (zł) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" step="0.01" min="0" className={`input ${errors.price ? 'border-red-400' : ''}`} />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="label">Ilość (szt.)</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="0" min="0" className={`input ${errors.quantity ? 'border-red-400' : ''}`} />
          </div>
        </div>

        {/* Is new */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" name="is_new" checked={form.is_new} onChange={handleChange} className="w-4 h-4 rounded text-blue-600 accent-blue-600" />
          <span className="text-sm font-medium text-gray-700">Oznacz jako <span className="text-blue-600">Nowość</span></span>
        </label>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/admin/produkty')} className="btn-secondary flex-1">
            Anuluj
          </button>
          <button type="submit" disabled={status === 'loading' || status === 'success'} className="btn-primary flex-1">
            {status === 'loading' ? <><Loader2 size={16} className="animate-spin" /> Zapisywanie...</> : isEdit ? 'Zapisz zmiany' : 'Dodaj produkt'}
          </button>
        </div>
      </form>
    </div>
  );
}
