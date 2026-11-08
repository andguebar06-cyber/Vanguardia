import React, { useState } from 'react';
import { Send, CheckCircle, ShieldCheck, Truck, RefreshCw, Heart, Database } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  onSelectCategory: (category: Category) => void;
  onOpenDbModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenDbModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      try {
        await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
      } catch (err) {
        console.warn('Newsletter local fallback:', err);
      }
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer id="main-footer" className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-neutral-800 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Envíos Gratuitos desde $50</h4>
              <p className="text-xs text-neutral-400">Despachos a todo el país con entrega garantizada.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Cambios y Devoluciones</h4>
              <p className="text-xs text-neutral-400">30 días naturales sin costo en tu primer cambio.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Transacción 100% Protegida</h4>
              <p className="text-xs text-neutral-400">Pasarela cifrada y múltiples métodos de pago.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-neutral-950 flex items-center justify-center font-serif font-black text-xl">
                V
              </div>
              <div>
                <span className="font-serif tracking-widest text-lg font-black text-white uppercase block leading-none">
                  Vanguardia
                </span>
                <span className="text-[10px] tracking-wider text-amber-400 font-semibold uppercase mt-1 block font-sans">
                  Siempre un paso adelante
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              <strong className="text-white font-semibold">Vanguardia</strong>: Innovación, estilo contemporáneo y calidad superior en moda, deportes, hogar y bienestar.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white block mb-2">
                Únete a Nuestro Newsletter
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 p-3 rounded-xl">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>¡Gracias! Te enviaremos promociones exclusivas y el 10% de bienvenida.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <span>Unirme</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Categories Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Colecciones</h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('oversize')}
                  className="hover:text-amber-400 transition-colors font-semibold text-amber-300 flex items-center gap-1"
                >
                  <span>Ropa Oversize & Gráficos</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded font-bold">HOT</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('hombre')}
                  className="hover:text-white transition-colors"
                >
                  Ropa de Hombre
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('mujer')}
                  className="hover:text-white transition-colors"
                >
                  Ropa de Mujer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('calzado')}
                  className="hover:text-white transition-colors"
                >
                  Calzado Urbano
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('accesorios')}
                  className="hover:text-white transition-colors"
                >
                  Accesorios & Bolsos
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('deportes')}
                  className="hover:text-emerald-400 transition-colors font-medium flex items-center gap-1"
                >
                  <span>Deportes & Fitness</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded font-bold">PRO</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('ofertas')}
                  className="hover:text-rose-400 transition-colors font-semibold"
                >
                  Zona de Rebajas
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Ayuda al Cliente</h5>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><span className="hover:text-white cursor-pointer">Seguimiento de Pedido</span></li>
              <li><span className="hover:text-white cursor-pointer">Guía de Tallas</span></li>
              <li><span className="hover:text-white cursor-pointer">Políticas de Devolución</span></li>
              <li><span className="hover:text-white cursor-pointer">Preguntas Frecuentes</span></li>
              <li><span className="hover:text-white cursor-pointer">Términos y Condiciones</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider">Contacto</h5>
            <div className="text-xs text-neutral-400 space-y-2">
              <p>Av. de la Moda 108, Distrito Central</p>
              <p>soporte@vanguardia-atelier.com</p>
              <p>+34 900 123 456 (Lun a Vie: 9:00 - 18:00)</p>
              <div className="pt-2 flex items-center gap-2 text-neutral-500">
                <span>Moda ética y confección sostenible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Vanguardia Atelier. Todos los derechos reservados.</p>

          {onOpenDbModal && (
            <button
              onClick={onOpenDbModal}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-emerald-500/50 transition-colors text-[11px]"
              title="Ver detalles de la base de datos Neon PostgreSQL"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Base de Datos: <strong className="text-emerald-400 font-normal">Neon PostgreSQL (Conectada)</strong></span>
            </button>
          )}

          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>para una experiencia de compra fluida</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
