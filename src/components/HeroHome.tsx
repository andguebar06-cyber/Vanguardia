import React from 'react';
import { ArrowRight, Sparkles, Shield, Clock, RotateCcw, Percent, Flame } from 'lucide-react';
import { Category } from '../types';

interface HeroHomeProps {
  onExploreClick: () => void;
  onSelectCategory: (category: Category) => void;
  currentCategory: Category;
}

export const HeroHome: React.FC<HeroHomeProps> = ({
  onExploreClick,
  onSelectCategory,
  currentCategory,
}) => {
  return (
    <section id="hero-home-screen" className="relative overflow-hidden bg-neutral-900 text-white">
      {/* Background decoration & overlay */}
      <div className="absolute inset-0 opacity-25 mix-blend-luminosity pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80"
          alt="Colección de moda de temporada"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-800/90 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Vanguardia • Siempre un paso adelante</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
              El estilo que define el mañana, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-amber-400 font-serif italic">hoy en tus manos</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-xl leading-relaxed">
              Explora moda contemporánea, uniformes deportivos oficiales, ropa técnica de entrenamiento, implementos fitness, juguetes, belleza, calzado y todo para tu hogar con despacho veloz.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-btn"
                type="button"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-neutral-950 font-bold text-sm hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-oversize-btn"
                type="button"
                onClick={() => {
                  onSelectCategory('oversize');
                  onExploreClick();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-neutral-950 font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Flame className="w-4 h-4 text-neutral-950 fill-neutral-950" />
                <span>Oversize Gráficos</span>
              </button>

              <button
                id="hero-home-dept-btn"
                type="button"
                onClick={() => {
                  onSelectCategory('hogar');
                  onExploreClick();
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-teal-300 font-semibold text-sm border border-neutral-700 transition-all hover:-translate-y-0.5"
              >
                <span>Hogar & Muebles</span>
              </button>

              <button
                id="hero-offers-btn"
                type="button"
                onClick={() => {
                  onSelectCategory('ofertas');
                  onExploreClick();
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-800 text-white font-medium text-sm border border-neutral-700 transition-all hover:-translate-y-0.5"
              >
                <Percent className="w-4 h-4 text-rose-400" />
                <span>Rebajas</span>
              </button>
            </div>

            {/* Category Quick Pills */}
            <div className="pt-3">
              <span className="text-xs uppercase tracking-wider text-neutral-400 block mb-2 font-medium">
                Acceso directo por departamento:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {([
                  { key: 'todos', label: 'Todo' },
                  { key: 'oversize', label: 'Oversize Anime 🔥' },
                  { key: 'infantil', label: 'Niños/as 👶' },
                  { key: 'vestidos-faldas', label: 'Vestidos & Faldas 👗' },
                  { key: 'jeans-blusas', label: 'Jeans & Blusas 👖' },
                  { key: 'hombre', label: 'Hombre' },
                  { key: 'mujer', label: 'Mujer' },
                  { key: 'ropa-interior', label: 'Ropa Interior 🩲' },
                  { key: 'calzado', label: 'Calzado 👟' },
                  { key: 'accesorios', label: 'Accesorios & Joyas 🕶️' },
                  { key: 'belleza-barberia', label: 'Belleza & Barbería 💈' },
                  { key: 'hogar', label: 'Hogar & Muebles 🛋️' },
                  { key: 'deportes', label: 'Deportes & Fitness ⚽' },
                  { key: 'juguetes', label: 'Juguetes 🧸' },
                ] as { key: Category; label: string }[]).map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.key);
                      onExploreClick();
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                      currentCategory === cat.key
                        ? 'bg-amber-400 text-neutral-950 font-bold'
                        : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Visual Badge card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Beneficios al Comprar
                </span>
                <span className="text-[11px] bg-emerald-950 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-800/60">
                  Servicio Premium
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-800/40 border border-neutral-800">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Despacho Veloz 24/48h</h4>
                    <p className="text-xs text-neutral-400">Entrega rápida con código de seguimiento en tiempo real.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-800/40 border border-neutral-800">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Pago Seguro & Cifrado</h4>
                    <p className="text-xs text-neutral-400">Tarjetas de crédito/débito, PayPal y pago contra entrega.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-800/40 border border-neutral-800">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">30 Días de Devolución</h4>
                    <p className="text-xs text-neutral-400">Si no te queda como esperabas, cámbialo sin coste alguno.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
