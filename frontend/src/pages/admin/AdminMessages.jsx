import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, Clock, CheckCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { contactApi } from '../../api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await contactApi.getMessages({ page, limit: 15 });
      setMessages(data.messages);
      setTotal(data.total);
      setUnread(data.unread);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleExpand = async (msg) => {
    const isOpening = expanded !== msg.id;
    setExpanded(isOpening ? msg.id : null);

    if (isOpening && !msg.is_read) {
      try {
        await contactApi.markRead(msg.id);
        setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: 1 } : m));
        setUnread((u) => Math.max(0, u - 1));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Wiadomości</h1>
          <p className="text-gray-500 text-sm">
            {total} wiadomości łącznie
            {unread > 0 && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread} nieprzeczytanych</span>}
          </p>
        </div>
        <button onClick={load} className="btn-secondary gap-2">
          <RefreshCw size={16} />
          Odśwież
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <MessageSquare size={44} className="mx-auto mb-3 opacity-30" />
            <p>Brak wiadomości</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`transition-colors ${!msg.is_read ? 'bg-blue-50/40' : ''}`}>
                {/* Row header */}
                <div
                  className="px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleExpand(msg)}
                >
                  <div className="flex items-start gap-3">
                    {/* Unread indicator */}
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!msg.is_read ? 'bg-blue-600' : 'bg-transparent'}`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{msg.name}</span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail size={12} />
                          {msg.email}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
                          <Clock size={11} />
                          {new Date(msg.created_at).toLocaleDateString('pl', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">{msg.message}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {msg.is_read ? (
                        <CheckCircle size={16} className="text-green-400" />
                      ) : (
                        <span className="text-xs text-blue-600 font-medium">Nowa</span>
                      )}
                      {expanded === msg.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                <AnimatePresence>
                  {expanded === msg.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-5">
                        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        </div>
                        <div className="flex gap-3 mt-3">
                          <a
                            href={`mailto:${msg.email}?subject=Re: Wiadomość ze strony Qwapek`}
                            className="btn-primary btn-sm gap-1.5"
                          >
                            <Mail size={14} />
                            Odpowiedz
                          </a>
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
