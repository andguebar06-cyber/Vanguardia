import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Heart, Check } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { getSizeDetails } from '../utils/sizeHelper';
import { ProductImageViewer } from './ProductImageViewer';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: ProductColor) => void;
  onQuickView: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isFavorite,
  onToggleFavorite,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Estándar', hex: '#111827' }
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1200);
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Dynamic size specification
  const sizeDetail = getSizeDetails(product.category, selectedSize, product.department);

  return (
    <article
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Image Container with Dynamic Color Rendering */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 cursor-pointer" onClick={() => onQuickView(product)}>
        <ProductImageViewer
          baseImage={product.image}
          productName={product.name}
          selectedColor={selectedColor}
          defaultColor={product.colors[0]}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out"
        />

        {/* Floating Active Color Pill on Image */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/80 text-white text-[11px] font-semibold backdrop-blur-md shadow-xs pointer-events-none transition-all">
          <span
            className="w-2.5 h-2.5 rounded-full border border-white/70 shrink-0"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <span className="truncate max-w-[125px]">{selectedColor.name}</span>
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.category === 'oversize' && (
            <div className="flex flex-wrap gap-1">
              <span className="bg-amber-400 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                OVERSIZE
              </span>
              {product.subtheme === 'anime' && (
                <span className="bg-neutral-900 text-rose-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-neutral-700">
                  <span>ANIME 🎌</span>
                </span>
              )}
            </div>
          )}
          {product.isSale && (
            <span className="bg-red-600 text-white text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs">
              -{discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-neutral-900 text-white text-[11px] font-bold uppercase px-2 py-0.5 rounded-md shadow-xs">
              Nuevo
            </span>
          )}
        </div>

        {/* Favorite Wishlist Button */}
        <button
          id={`fav-btn-${product.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-rose-600 shadow-sm transition-transform active:scale-90 z-10 backdrop-blur-xs"
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Quick View Button on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex justify-center z-10">
          <button
            id={`quickview-btn-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 px-3 rounded-xl bg-white/95 hover:bg-white text-neutral-900 text-xs font-bold uppercase tracking-wider shadow-md backdrop-blur-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Vista Rápida</span>
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-neutral-500 truncate max-w-[60%]">
              {product.department || (
                product.category === 'oversize'
                  ? `Oversize • ${product.subtheme === 'anime' ? 'Anime' : product.subtheme === 'lugares' ? 'Lugares' : product.subtheme === 'famosos' ? 'Iconos' : 'Gráfico'}`
                  : product.category
              )}
            </span>
            <div className="flex items-center gap-1 text-amber-500 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-neutral-800 text-xs">{product.rating}</span>
              <span className="text-neutral-400 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            className="font-medium text-neutral-900 text-sm sm:text-base leading-snug line-clamp-2 hover:text-neutral-700 cursor-pointer"
            onClick={() => onQuickView(product)}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-lg font-bold text-neutral-900 tracking-tight">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Controls: Sizes & Colors */}
        <div className="space-y-2.5 pt-2 border-t border-neutral-100">
          {/* Size Selector with Live Dimension Feedback */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 text-[11px] font-medium">
                Talla: <strong className="text-neutral-900 font-bold">{selectedSize}</strong>
              </span>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border transition-all ${
                      selectedSize === size
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Live Size Measurements Badge */}
            <div className="text-[10px] text-neutral-600 font-medium truncate bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100 flex items-center gap-1">
              <span className="text-neutral-400 shrink-0">📏</span>
              <span className="truncate">{sizeDetail.dimensionLabel}</span>
            </div>
          </div>

          {/* Color Selector */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-neutral-500 text-[11px] font-medium truncate max-w-[50%]">
              Color: <strong className="text-neutral-900 font-bold">{selectedColor.name}</strong>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  title={`${c.name} (Clic para cambiar color del producto)`}
                  onClick={() => setSelectedColor(c)}
                  className={`w-5 h-5 rounded-full border transition-all relative ${
                    selectedColor.name === c.name
                      ? 'ring-2 ring-offset-1 ring-neutral-900 scale-110 border-white shadow-xs'
                      : 'border-neutral-300 opacity-85 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}

              {/* Custom Color Picker to choose any color to the buyer's taste */}
              <label
                title="Elige cualquier color a tu gusto para la prenda u objeto (el fondo permanece intacto)"
                className={`relative w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:scale-110 ${
                  selectedColor.name === 'A tu gusto'
                    ? 'ring-2 ring-offset-1 ring-neutral-900 border-white scale-110 shadow-xs'
                    : 'border-neutral-300'
                }`}
                style={{
                  background:
                    'conic-gradient(from 180deg at 50% 50%, #ef4444 0deg, #f59e0b 60deg, #10b981 120deg, #06b6d4 180deg, #3b82f6 240deg, #a855f7 300deg, #ef4444 360deg)',
                }}
              >
                <input
                  type="color"
                  value={selectedColor.hex}
                  onChange={(e) => {
                    const newHex = e.target.value;
                    setSelectedColor({
                      name: 'A tu gusto',
                      hex: newHex,
                    });
                  }}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          id={`add-to-cart-btn-${product.id}`}
          type="button"
          onClick={handleAdd}
          disabled={addedAnimation}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            addedAnimation
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs hover:shadow active:scale-98'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4" />
              <span>¡Agregado al Carrito!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Añadir al Carrito</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
