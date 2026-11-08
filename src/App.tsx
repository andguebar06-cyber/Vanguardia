import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroHome } from './components/HeroHome';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductModal } from './components/ProductModal';
import { Footer } from './components/Footer';
import { NeonDbModal } from './components/NeonDbModal';
import { PRODUCTS_DATA } from './data/products';
import { Product, ProductColor, CartItem, Category, SortOption, OversizeSubtheme } from './types';
import { SlidersHorizontal, ArrowUpDown, Sparkles, ShoppingBag, X, Check, Heart, Flame, MapPin, Tv, Star, Database } from 'lucide-react';

const CART_STORAGE_KEY = 'vanguardia_cart_items_v1';
const FAVS_STORAGE_KEY = 'vanguardia_favorites_v1';

export default function App() {
  // Live products loaded from Neon PostgreSQL (with fallback to local data)
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS_DATA);
  const [isNeonModalOpen, setIsNeonModalOpen] = useState(false);
  const [dbHealth, setDbHealth] = useState<{
    connected: boolean;
    latencyMs?: number;
    tables?: { products: number; orders: number; subscribers: number };
  } | null>(null);

  // Shopping cart state with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Favorites state with localStorage persistence
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [currentCategory, setCurrentCategory] = useState<Category>('todos');
  const [oversizeSubtheme, setOversizeSubtheme] = useState<OversizeSubtheme>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('destacados');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string } | null>(null);

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem(FAVS_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Error saving favorites:', e);
    }
  }, [favoriteIds]);

  // Load live products & health check from Neon PostgreSQL
  useEffect(() => {
    fetch('/api/db/health')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.connected) {
          setDbHealth(data);
        }
      })
      .catch((err) => console.warn('Could not query /api/db/health:', err));

    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProductsList(data);
        }
      })
      .catch((err) => console.warn('Using local products fallback:', err));
  }, []);

  // Cart calculations
  const totalCartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Add to cart handler
  const handleAddToCart = (
    product: Product,
    size: string,
    color: ProductColor,
    quantity = 1
  ) => {
    const itemId = `${product.id}-${size}-${color.name}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id: itemId, product, size, color, quantity }];
    });

    // Toast notification
    setToastMessage({
      title: '¡Artículo agregado al carrito!',
      subtitle: `${product.name} (${size}, ${color.name})`,
    });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Update quantity in cart
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove single item from cart
  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all cart items
  const handleClearCart = () => {
    setCart([]);
  };

  // Toggle favorite
  const handleToggleFavorite = (product: Product) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        return prev.filter((id) => id !== product.id);
      }
      return [...prev, product.id];
    });
  };

  // Order completed flow
  const handleOrderCompleted = () => {
    setCart([]);
  };

  // Scroll to catalog section
  const handleScrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Favorites filter
      if (showingFavoritesOnly && !favoriteIds.includes(product.id)) {
        return false;
      }

      // Category filter
      if (currentCategory === 'ofertas') {
        if (!product.isSale) return false;
      } else if (currentCategory === 'oversize') {
        if (product.category !== 'oversize') return false;
        if (oversizeSubtheme !== 'todos' && product.subtheme !== oversizeSubtheme) {
          return false;
        }
      } else if (currentCategory !== 'todos') {
        if (product.category !== currentCategory) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDept = product.department?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesDept) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'precio-bajo') return a.price - b.price;
      if (sortOption === 'precio-alto') return b.price - a.price;
      if (sortOption === 'mejor-calificados') return b.rating - a.rating;
      // destacados (default)
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [currentCategory, oversizeSubtheme, searchQuery, sortOption, showingFavoritesOnly, favoriteIds]);

  const categories = [
    { key: 'todos', label: 'Todo' },
    { key: 'oversize', label: 'Oversize Gráficos 🔥' },
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
    { key: 'ofertas', label: 'Ofertas 🔥' },
  ] as const;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-neutral-900 selection:text-white">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-3 max-w-sm">
            <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold leading-tight">{toastMessage.title}</p>
              {toastMessage.subtitle && (
                <p className="text-[11px] text-neutral-300 truncate mt-0.5">{toastMessage.subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setToastMessage(null);
                setIsCartOpen(true);
              }}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 underline shrink-0 ml-1"
            >
              Ver Carrito
            </button>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-neutral-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar with Dropdown Menu */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setShowingFavoritesOnly(false);
          handleScrollToCatalog();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
        favoritesCount={favoriteIds.length}
        onToggleFavoritesOnly={() => {
          setShowingFavoritesOnly(!showingFavoritesOnly);
          handleScrollToCatalog();
        }}
        showingFavoritesOnly={showingFavoritesOnly}
        onGoHome={() => {
          setCurrentCategory('todos');
          setShowingFavoritesOnly(false);
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Pantalla / Ventana de Inicio (Hero Showcase) */}
      {!showingFavoritesOnly && !searchQuery && (
        <HeroHome
          onExploreClick={handleScrollToCatalog}
          onSelectCategory={(cat) => {
            setCurrentCategory(cat);
            handleScrollToCatalog();
          }}
          currentCategory={currentCategory}
        />
      )}

      {/* Main Catalog & Clothing Products Section */}
      <main ref={catalogSectionRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Section Header with Category Tabs & Sorting Controls */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200/80 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {showingFavoritesOnly
                    ? 'Tus Prendas Favoritas'
                    : currentCategory === 'ofertas'
                    ? 'Zona de Rebajas Especiales'
                    : 'Colección de Ropa y Accesorios'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 tracking-tight">
                {showingFavoritesOnly
                  ? `Artículos en Lista de Deseos (${filteredProducts.length})`
                  : currentCategory === 'todos'
                  ? 'Catálogo Completo'
                  : currentCategory === 'oversize'
                  ? 'Colección Oversize: Animes, Lugares & Famosos'
                  : currentCategory === 'infantil'
                  ? 'Moda Infantil: Ropa para Niños & Niñas'
                  : currentCategory === 'vestidos-faldas'
                  ? 'Vestidos & Faldas de Colección'
                  : currentCategory === 'jeans-blusas'
                  ? 'Jeans Premium & Blusas Elegantes'
                  : currentCategory === 'hombre'
                  ? 'Moda Masculina'
                  : currentCategory === 'mujer'
                  ? 'Moda Femenina'
                  : currentCategory === 'ropa-interior'
                  ? 'Ropa Interior & Lencería (Adultos)'
                  : currentCategory === 'calzado'
                  ? 'Calzado de Tendencia, Sneakers Urbanos & Sandalias Chic'
                  : currentCategory === 'accesorios'
                  ? 'Accesorios, Gafas de Sol, Relojes & Joyería'
                  : currentCategory === 'belleza-barberia'
                  ? 'Belleza, Maquillaje, Cuidado Capilar & Barbería'
                  : currentCategory === 'hogar'
                  ? 'Hogar, Muebles, Cocina, Baño & Electrodomésticos'
                  : currentCategory === 'deportes'
                  ? 'Deportes, Uniformes, Ropa Deportiva & Implementos'
                  : currentCategory === 'juguetes'
                  ? 'Juguetes, Juegos Didácticos & Regalos'
                  : 'Rebajas de Temporada'}
              </h2>
              {searchQuery ? (
                <p className="text-xs text-neutral-500 mt-1">
                  Resultados para la búsqueda: &quot;<strong className="text-neutral-900">{searchQuery}</strong>&quot;
                </p>
              ) : (
                <p className="text-xs text-neutral-500 mt-1">
                  {currentCategory === 'oversize' && 'Prendas drop-shoulder de alto gramaje con serigrafías de animes de culto, urbes legendarias e iconos globales.'}
                  {currentCategory === 'infantil' && 'Ropa cómoda y transpirable confeccionada en algodón hipoalergénico para niños y niñas.'}
                  {currentCategory === 'vestidos-faldas' && 'Vestidos fluidos de lino floral, satén para galas y faldas vaqueras o plisadas.'}
                  {currentCategory === 'jeans-blusas' && 'Pantalones vaqueros barrel, cargo y baggy para dama y caballero junto a blusas de satén y encaje.'}
                  {currentCategory === 'ropa-interior' && 'Lencería femenina de encaje francés, pijamas de satén y bóxers masculinos de algodón modal.'}
                  {currentCategory === 'calzado' && 'Sneakers virales de tendencia, sandalias de tacón elegante y de cuña para mujer y calzado artesanal.'}
                  {currentCategory === 'accesorios' && 'Tocados joya para ceremonias, sombreros fedora de lana, pamelas de paja, boinas francesas, gafas de sol y joyería 18K.'}
                  {currentCategory === 'belleza-barberia' && 'Perfumería de autor, paletas de sombras, planchas de titanio, secadores iónicos y cortapelos de barbería.'}
                  {currentCategory === 'hogar' && 'Sofá cama convertible, colchones ortopédicos, almohadas viscoelásticas, alfombras nórdicas, freidoras de aire, cafeteras, toallas y baldosas.'}
                  {currentCategory === 'deportes' && 'Uniformes completos de fútbol y baloncesto, conjuntos ciclistas, leggings compresivos, camisetas dry-fit, balones FIFA, bandas elásticas, mancuernas y mats de yoga.'}
                  {currentCategory === 'juguetes' && 'Bloques modulares de construcción, osos de peluche gigantes y coches todoterreno a control remoto.'}
                  {currentCategory === 'todos' && 'Explora nuestro catálogo completo de moda, belleza, hogar, juguetes y tecnología.'}
                  {currentCategory === 'ofertas' && 'Aprovecha descuentos de hasta el 30% en artículos y prendas seleccionadas.'}
                </p>
              )}
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Category selector pills */}
              <div className="hidden sm:flex items-center p-1 bg-neutral-200/60 rounded-xl overflow-x-auto max-w-xl scrollbar-thin">
                {categories.map((cat) => {
                  const isActive = currentCategory === cat.key && !showingFavoritesOnly;
                  return (
                    <button
                      key={cat.key}
                      id={`tab-cat-${cat.key}`}
                      type="button"
                      onClick={() => {
                        setCurrentCategory(cat.key);
                        setShowingFavoritesOnly(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-700 shadow-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                <label htmlFor="sort-select" className="sr-only">Ordenar por</label>
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent focus:outline-none font-medium cursor-pointer text-xs"
                >
                  <option value="destacados">Destacados</option>
                  <option value="precio-bajo">Precio: menor a mayor</option>
                  <option value="precio-alto">Precio: mayor a menor</option>
                  <option value="mejor-calificados">Mejor Calificados</option>
                </select>
              </div>

              {/* Neon PostgreSQL Live Status Button */}
              <button
                type="button"
                onClick={() => setIsNeonModalOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-xs cursor-pointer transition-all"
                title="Base de datos Neon PostgreSQL conectada y activa"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Neon PostgreSQL</span>
                <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.5 rounded-full font-mono">
                  {dbHealth?.tables?.products ?? productsList.length}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Category Horizontal Scroll */}
          <div className="flex sm:hidden overflow-x-auto pb-2 gap-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  setCurrentCategory(cat.key);
                  setShowingFavoritesOnly(false);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border shrink-0 transition-colors ${
                  currentCategory === cat.key && !showingFavoritesOnly
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-700 border-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dedicated Subtheme Filter for Oversize Collection */}
          {currentCategory === 'oversize' && !showingFavoritesOnly && (
            <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-4 sm:p-5 rounded-2xl text-white shadow-lg border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>Corte Boxy / Drop-Shoulder 240+ GSM</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Explora por temática de diseño:
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'todos', label: 'Todos los Gráficos', icon: <Sparkles className="w-3.5 h-3.5" /> },
                  { key: 'anime', label: 'Anime & Manga 🎌', icon: <Tv className="w-3.5 h-3.5 text-rose-400" /> },
                  { key: 'lugares', label: 'Sitios Famosos 🗺️', icon: <MapPin className="w-3.5 h-3.5 text-emerald-400" /> },
                  { key: 'famosos', label: 'Personas & Leyendas 🌟', icon: <Star className="w-3.5 h-3.5 text-amber-400" /> },
                ].map((sub) => (
                  <button
                    key={sub.key}
                    type="button"
                    onClick={() => setOversizeSubtheme(sub.key as OversizeSubtheme)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      oversizeSubtheme === sub.key
                        ? 'bg-amber-400 text-neutral-950 shadow-md scale-102'
                        : 'bg-neutral-800/90 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/60'
                    }`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick Anime Franchise Pills */}
              {(oversizeSubtheme === 'anime' || oversizeSubtheme === 'todos') && (
                <div className="w-full pt-3 mt-1 border-t border-neutral-800/80 flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Series populares:
                  </span>
                  {[
                    { label: 'Dragon Ball Z', query: 'Dragon Ball' },
                    { label: 'Demon Slayer', query: 'Demon Slayer' },
                    { label: 'Ataque a los Titanes', query: 'Attack on Titan' },
                    { label: 'Naruto Shippuden', query: 'Naruto' },
                    { label: 'My Hero Academia', query: 'My Hero Academia' },
                    { label: 'Gengar & Pokémon', query: 'Gengar' },
                    { label: 'Jujutsu Kaisen', query: 'Jujutsu Kaisen' },
                    { label: 'Lofi Cyber', query: 'Scanline' },
                  ].map((anime) => {
                    const isSelected = searchQuery.toLowerCase() === anime.query.toLowerCase();
                    return (
                      <button
                        key={anime.query}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSearchQuery('');
                          } else {
                            setSearchQuery(anime.query);
                            setOversizeSubtheme('anime');
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/50'
                        }`}
                      >
                        {anime.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4 max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">No encontramos productos</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                No hay prendas que coincidan con los criterios seleccionados. Prueba a cambiar de categoría o limpiar la búsqueda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCurrentCategory('todos');
                setSearchQuery('');
                setShowingFavoritesOnly(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div
            id="products-grid"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onQuickView={setSelectedProductForModal}
                isFavorite={favoriteIds.includes(product.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}

      </main>

      {/* Sliding Functional Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout and Order Placement Flow */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Quick View Product Modal */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Application Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setShowingFavoritesOnly(false);
          handleScrollToCatalog();
        }}
        onOpenDbModal={() => setIsNeonModalOpen(true)}
      />

      {/* Neon PostgreSQL Database Status & Orders Modal */}
      <NeonDbModal
        isOpen={isNeonModalOpen}
        onClose={() => setIsNeonModalOpen(false)}
      />
    </div>
  );
}
