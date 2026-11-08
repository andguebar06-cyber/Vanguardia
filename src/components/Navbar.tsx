import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ChevronDown,
  Heart,
  Sparkles,
  Tag,
  Shirt,
  Footprints,
  Watch,
  ShieldCheck,
  Truck,
  RefreshCw,
  Flame,
  Baby,
  Scissors,
  Home,
  Gift,
  Gem,
  Layers,
  Dumbbell,
  Trophy,
} from 'lucide-react';
import { Category } from '../types';

interface NavbarProps {
  currentCategory: Category;
  onSelectCategory: (cat: Category) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  favoritesCount: number;
  onToggleFavoritesOnly: () => void;
  showingFavoritesOnly: boolean;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
  favoritesCount,
  onToggleFavoritesOnly,
  showingFavoritesOnly,
  onGoHome,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [infoModal, setInfoModal] = useState<string | null>(null);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const optionsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (optionsDropdownRef.current && !optionsDropdownRef.current.contains(event.target as Node)) {
        setMoreOptionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categoriesList: { key: Category; label: string; icon: React.ReactNode; desc: string; badge?: string }[] = [
    { key: 'todos', label: 'Todo el Catálogo', icon: <Sparkles className="w-4 h-4 text-amber-500" />, desc: 'Explora todos los departamentos de la tienda' },
    { key: 'oversize', label: 'Ropa Oversize & Anime', icon: <Flame className="w-4 h-4 text-orange-500" />, desc: 'Dragon Ball, Naruto, Demon Slayer, Titanes, Pokémon y más', badge: 'ANIME 🔥' },
    { key: 'infantil', label: 'Ropa Niños & Niñas', icon: <Baby className="w-4 h-4 text-sky-500" />, desc: 'Conjuntos, vestidos, camisetas y divertidos básicos', badge: 'NUEVO' },
    { key: 'vestidos-faldas', label: 'Vestidos & Faldas', icon: <Shirt className="w-4 h-4 text-rose-500" />, desc: 'Vestidos de gala, lino floral y faldas denim / plisadas' },
    { key: 'jeans-blusas', label: 'Jeans & Blusas', icon: <Layers className="w-4 h-4 text-indigo-500" />, desc: 'Vaqueros wide leg, blusas de seda y encaje romántico' },
    { key: 'hombre', label: 'Moda Masculina', icon: <Shirt className="w-4 h-4 text-blue-600" />, desc: 'Chaquetas cuero, camisas de pana y prendas de vestir' },
    { key: 'mujer', label: 'Moda Femenina', icon: <Shirt className="w-4 h-4 text-pink-500" />, desc: 'Blazers sastre, abrigos y moda contemporánea' },
    { key: 'ropa-interior', label: 'Ropa Interior & Lencería', icon: <Heart className="w-4 h-4 text-red-500" />, desc: 'Lencería femenina, bralettes, pijamas y bóxers masculinos' },
    { key: 'calzado', label: 'Calzado & Zapatillas', icon: <Footprints className="w-4 h-4 text-emerald-500" />, desc: 'Tenis urbanos y skate, sandalias de chica, mocasines, botines y medias tobilleras' },
    { key: 'accesorios', label: 'Accesorios, Tocados & Joyería', icon: <Watch className="w-4 h-4 text-amber-600" />, desc: 'Tocados de fiesta, sombreros fedora, pamelas, boinas, gafas y joyería 18K' },
    { key: 'belleza-barberia', label: 'Belleza, Pelo & Barbería', icon: <Scissors className="w-4 h-4 text-purple-600" />, desc: 'Maquillajes, perfumes, planchas de pelo, secadores y máquinas' },
    { key: 'hogar', label: 'Hogar, Muebles & Cocina', icon: <Home className="w-4 h-4 text-teal-600" />, desc: 'Sofás, vajillas, platos, vasos, cubertería, tazas, electrodomésticos y baldosas' },
    { key: 'deportes', label: 'Deportes, Uniformes & Fitness', icon: <Dumbbell className="w-4 h-4 text-emerald-600" />, desc: 'Ropa técnica, uniformes de fútbol/basket, pesas y balones', badge: 'FITNESS' },
    { key: 'juguetes', label: 'Juguetes & Juegos', icon: <Gift className="w-4 h-4 text-amber-500" />, desc: 'Bloques de construcción, peluches gigantes y coches RC' },
    { key: 'ofertas', label: 'Rebajas & Liquidación', icon: <Tag className="w-4 h-4 text-red-600" />, desc: 'Prendas y artículos seleccionados con hasta -30%', badge: 'PROMO' },
  ];

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div id="top-announcement-bar" className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 text-center font-medium border-b border-neutral-800 flex justify-center items-center gap-4 flex-wrap">
        <span className="text-amber-400 font-semibold tracking-wider text-[11px] uppercase hidden sm:inline">
          Vanguardia • Siempre un paso adelante
        </span>
        <span className="hidden sm:inline text-neutral-700">|</span>
        <span className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-emerald-400 inline" />
          Envío gratis a partir de $50 USD
        </span>
        <span className="hidden md:inline text-neutral-600">|</span>
        <span className="hidden md:flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-amber-400 inline" />
          Devoluciones fáciles y sin costo durante 30 días
        </span>
        <span className="hidden lg:inline text-neutral-600">|</span>
        <span className="hidden lg:flex items-center gap-1.5 text-rose-300">
          <Tag className="w-3.5 h-3.5 inline" />
          Usa el cupón <strong className="font-bold underline tracking-wider ml-1">MODA10</strong> para 10% extra
        </span>
      </div>

      {/* Main Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-3 sm:gap-6">
            
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <button
                id="mobile-menu-toggle-btn"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-neutral-900"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                id="brand-logo-btn"
                type="button"
                onClick={onGoHome}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-serif font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
                  V
                </div>
                <div>
                  <span className="block font-serif tracking-widest text-lg sm:text-xl font-black text-neutral-900 uppercase leading-none">
                    Vanguardia
                  </span>
                  <span className="block text-[9.5px] sm:text-[10px] tracking-wider text-amber-700 font-bold uppercase mt-1 font-sans">
                    Siempre un paso adelante
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links & Dropdown Menu */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                id="nav-home-btn"
                type="button"
                onClick={onGoHome}
                className="px-3.5 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Inicio
              </button>

              {/* Menú de opciones desplegable: Categorías */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  id="categories-dropdown-btn"
                  type="button"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setMoreOptionsOpen(false);
                  }}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                    dropdownOpen || currentCategory !== 'todos'
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                  aria-expanded={dropdownOpen}
                >
                  <span>Colecciones y Categorías</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Panel */}
                {dropdownOpen && (
                  <div
                    id="categories-dropdown-menu"
                    className="absolute left-0 mt-2 w-[620px] max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-neutral-200 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3 pb-2 mb-2 border-b border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Departamentos & Colecciones
                      </span>
                      <span className="text-[11px] text-neutral-500 font-medium">
                        15 Departamentos disponibles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[70vh] overflow-y-auto pr-1">
                      {categoriesList.map((cat) => {
                        const isSelected = currentCategory === cat.key && !showingFavoritesOnly;
                        return (
                          <button
                            key={cat.key}
                            id={`dropdown-cat-${cat.key}`}
                            type="button"
                            onClick={() => {
                              onSelectCategory(cat.key);
                              setDropdownOpen(false);
                            }}
                            className={`text-left px-3 py-2 rounded-xl flex items-start gap-2.5 hover:bg-neutral-50 transition-colors ${
                              isSelected ? 'bg-neutral-100 font-semibold' : ''
                            }`}
                          >
                            <div className="mt-0.5 p-1.5 rounded-lg bg-neutral-100 border border-neutral-200/60 shrink-0">
                              {cat.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs sm:text-sm text-neutral-900 truncate">{cat.label}</span>
                                {cat.badge && (
                                  <span className="text-[9px] sm:text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                                    {cat.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-500 line-clamp-1">{cat.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Menú de opciones desplegable: Servicios & Opciones de Tienda */}
              <div className="relative" ref={optionsDropdownRef}>
                <button
                  id="more-options-dropdown-btn"
                  type="button"
                  onClick={() => {
                    setMoreOptionsOpen(!moreOptionsOpen);
                    setDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                    moreOptionsOpen ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
                  }`}
                  aria-expanded={moreOptionsOpen}
                >
                  <span>Opciones de Tienda</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreOptionsOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreOptionsOpen && (
                  <div
                    id="store-options-dropdown-menu"
                    className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-3.5 py-2 border-b border-neutral-100">
                      <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Información y Servicios
                      </span>
                    </div>
                    <button
                      id="opt-shipping-info"
                      type="button"
                      onClick={() => {
                        setInfoModal('shipping');
                        setMoreOptionsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5"
                    >
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-medium text-neutral-900">Envíos y Tarifas</div>
                        <div className="text-xs text-neutral-500">Tiempos y cobertura nacional</div>
                      </div>
                    </button>
                    <button
                      id="opt-guarantee-info"
                      type="button"
                      onClick={() => {
                        setInfoModal('guarantee');
                        setMoreOptionsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-neutral-900">Garantía y Calidad</div>
                        <div className="text-xs text-neutral-500">30 días de satisfacción total</div>
                      </div>
                    </button>
                    <button
                      id="opt-sizes-info"
                      type="button"
                      onClick={() => {
                        setInfoModal('sizes');
                        setMoreOptionsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2.5"
                    >
                      <Shirt className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="font-medium text-neutral-900">Guía de Tallas</div>
                        <div className="text-xs text-neutral-500">Medidas exactas hombre y mujer</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-xs md:max-w-md mx-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  id="product-search-input"
                  type="text"
                  placeholder="Buscar anime, Naruto, Dragon Ball, sudaderas, calzado..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-neutral-100/90 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-300 rounded-full text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Action Icons: Favorites & Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Favorites Toggle Button */}
              <button
                id="favorites-filter-btn"
                type="button"
                onClick={onToggleFavoritesOnly}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 text-sm font-medium transition-all ${
                  showingFavoritesOnly
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
                title={showingFavoritesOnly ? 'Ver todos los productos' : 'Ver productos favoritos'}
              >
                <Heart className={`w-5 h-5 ${showingFavoritesOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span className="hidden sm:inline">Deseos</span>
                {favoritesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Functional Shopping Cart Button */}
              <button
                id="open-cart-drawer-btn"
                type="button"
                onClick={onOpenCart}
                className="relative bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-xl font-medium text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
                aria-label="Ver carrito de compras"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span
                      id="cart-badge-counter"
                      className="absolute -top-2 -right-2.5 bg-amber-500 text-neutral-950 font-black text-[11px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-xs animate-bounce"
                    >
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Carrito</span>
                  <span className="font-bold text-xs">${cartTotal.toFixed(2)}</span>
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div id="mobile-nav-panel" className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Menú de Categorías
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto p-1">
                {categoriesList.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.key);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs sm:text-sm font-medium border transition-colors ${
                      currentCategory === cat.key && !showingFavoritesOnly
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200/60 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="shrink-0">{cat.icon}</div>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-100 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Opciones y Políticas
              </span>
              <div className="flex flex-col gap-1 text-sm text-neutral-700">
                <button
                  type="button"
                  onClick={() => {
                    setInfoModal('shipping');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-left hover:text-neutral-950 flex items-center gap-2"
                >
                  <Truck className="w-4 h-4 text-neutral-500" /> Envíos rápidos y seguimiento
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInfoModal('guarantee');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-left hover:text-neutral-950 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-neutral-500" /> Garantía de cambio y devolución
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInfoModal('sizes');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-left hover:text-neutral-950 flex items-center gap-2"
                >
                  <Shirt className="w-4 h-4 text-neutral-500" /> Tabla de tallas y medidas
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Info Modals for store options */}
      {infoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setInfoModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 p-1 rounded-full hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            {infoModal === 'shipping' && (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Envíos y Tiempos de Entrega</h3>
                <p className="text-sm text-neutral-600">
                  Realizamos despachos a todo el país. Los pedidos realizados antes de las 14:00 hrs se procesan el mismo día laborable.
                </p>
                <ul className="text-sm space-y-2 text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-200/70">
                  <li><strong>Envío Estándar (2 a 4 días):</strong> $4.99 o GRATIS en compras desde $50.</li>
                  <li><strong>Envío Express (24 a 48 horas):</strong> $9.99 garantizado.</li>
                  <li><strong>Seguimiento:</strong> Recibirás un enlace con tracking en tu email tras el despacho.</li>
                </ul>
              </div>
            )}

            {infoModal === 'guarantee' && (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Garantía de Satisfacción 100%</h3>
                <p className="text-sm text-neutral-600">
                  Si no estás completamente satisfecho con la talla, el corte o el material, puedes solicitar cambio o reembolso sin complicaciones.
                </p>
                <div className="text-sm space-y-1.5 text-neutral-700 bg-neutral-50 p-4 rounded-xl border border-neutral-200/70">
                  <p>✔ 30 días naturales para cambios y devoluciones.</p>
                  <p>✔ Las prendas deben conservar sus etiquetas originales.</p>
                  <p>✔ Proceso 100% gestionado de forma gratuita en tu primer cambio.</p>
                </div>
              </div>
            )}

            {infoModal === 'sizes' && (
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Shirt className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Guía de Tallas General</h3>
                <p className="text-xs text-neutral-500">Medidas de referencia estándar para prendas superiores e inferiores:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-neutral-200 rounded-lg overflow-hidden">
                    <thead className="bg-neutral-100 font-semibold text-neutral-700">
                      <tr>
                        <th className="p-2 border-b">Talla</th>
                        <th className="p-2 border-b">Pecho (cm)</th>
                        <th className="p-2 border-b">Cintura (cm)</th>
                        <th className="p-2 border-b">Cadera (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-600">
                      <tr><td className="p-2 font-bold">XS</td><td className="p-2">84-88</td><td className="p-2">66-70</td><td className="p-2">90-94</td></tr>
                      <tr><td className="p-2 font-bold">S</td><td className="p-2">88-94</td><td className="p-2">70-76</td><td className="p-2">94-100</td></tr>
                      <tr><td className="p-2 font-bold">M</td><td className="p-2">94-102</td><td className="p-2">76-84</td><td className="p-2">100-108</td></tr>
                      <tr><td className="p-2 font-bold">L</td><td className="p-2">102-110</td><td className="p-2">84-92</td><td className="p-2">108-116</td></tr>
                      <tr><td className="p-2 font-bold">XL</td><td className="p-2">110-118</td><td className="p-2">92-100</td><td className="p-2">116-124</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mt-5 text-right">
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="bg-neutral-900 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-neutral-800"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
