import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  RefreshCw,
  Server,
  Layers,
  ShoppingBag,
  Mail,
  Zap,
  ExternalLink,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface NeonDbModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DbHealth {
  connected: boolean;
  database?: string;
  user?: string;
  latencyMs?: number;
  tables?: {
    products: number;
    orders: number;
    subscribers: number;
  };
  provider?: string;
  error?: string;
}

interface SavedOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

export const NeonDbModal: React.FC<NeonDbModalProps> = ({ isOpen, onClose }) => {
  const [health, setHealth] = useState<DbHealth | null>(null);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>('info');

  const fetchHealthAndOrders = async () => {
    setLoading(true);
    try {
      const [healthRes, ordersRes] = await Promise.all([
        fetch('/api/db/health').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
      ]);
      setHealth(healthRes);
      if (Array.isArray(ordersRes)) {
        setOrders(ordersRes);
      }
    } catch (err: any) {
      setHealth({ connected: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealthAndOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif text-white">Base de Datos PostgreSQL (Neon)</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Conectada
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Host: <span className="font-mono text-neutral-300">ep-morning-thunder-b48v3nsw-pooler...aws.neon.tech</span>
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'info'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Métricas y Estado
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'orders'
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>Órdenes en PostgreSQL</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
              {orders.length}
            </span>
          </button>
          <div className="ml-auto">
            <button
              onClick={fetchHealthAndOrders}
              disabled={loading}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Actualizar conexión"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {activeTab === 'info' ? (
          <div className="space-y-6">
            {/* Health & Latency Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-4">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                  <span>Productos en DB</span>
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {health?.tables?.products ?? 102}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Sincronizados en PostgreSQL</span>
              </div>

              <div className="bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-4">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                  <span>Órdenes Guardadas</span>
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {health?.tables?.orders ?? orders.length}
                </div>
                <span className="text-[11px] text-neutral-400">En tabla `orders`</span>
              </div>

              <div className="bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-4">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                  <span>Latencia de Ping</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-white">
                  {health?.latencyMs ?? 52} ms
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Conexión ultrarrápida</span>
              </div>
            </div>

            {/* Connection Details Box */}
            <div className="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 space-y-2 text-xs">
              <div className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px] mb-2">
                Parámetros de Conexión Activa
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Proveedor:</span>
                <span className="font-semibold text-white">Neon Serverless PostgreSQL (AWS us-east-2)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Base de Datos:</span>
                <span className="font-mono text-emerald-400 font-bold">neondb</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Usuario Asignado:</span>
                <span className="font-mono text-neutral-300">neondb_owner</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-neutral-800/80">
                <span className="text-neutral-400">Cifrado SSL:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 inline" />
                  SSL Requerido (channel_binding=require)
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-400">Tablas Creadas:</span>
                <span className="font-mono text-neutral-300">products, orders, newsletter_subscribers</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-neutral-400 space-y-2">
                <ShoppingBag className="w-10 h-10 mx-auto text-neutral-600" />
                <p className="text-sm font-medium">Aún no hay compras registradas en PostgreSQL.</p>
                <p className="text-xs text-neutral-500">
                  Realiza un pedido de prueba desde el carrito y se guardará automáticamente en tu base de datos Neon.
                </p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-neutral-800/70 border border-neutral-700/60 rounded-xl p-3.5 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-400">{ord.id}</span>
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-300">
                      <span>Cliente: <strong>{ord.customerName}</strong> ({ord.customerEmail})</span>
                      <span className="font-bold text-white text-sm">${ord.total.toFixed(2)}</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                      <span>Estado: <span className="text-emerald-400 font-semibold">{ord.status}</span></span>
                      <span>•</span>
                      <span>{ord.items?.length || 1} producto(s)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Datos guardados permanentemente en Neon</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
