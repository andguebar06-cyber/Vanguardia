import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, Shield, Truck, RotateCcw, Ruler, ChevronDown, ChevronUp } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { getSizeDetails } from '../utils/sizeHelper';
import { ProductImageViewer } from './ProductImageViewer';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Estándar', hex: '#111827' }
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [showFullSizeChart, setShowFullSizeChart] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1100);
  };

  const sizeDetail = getSizeDetails(product.category, selectedSize, product.department);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-6 flex items-center justify-center bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div
        id="product-modal-container"
        className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-neutral-200 relative overflow-hidden my-auto max-h-[92vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 p-2 rounded-full hover:bg-neutral-100 transition-colors z-20"
          aria-label="Cerrar modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Visual Product Gallery & Color Viewer */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs">
              <ProductImageViewer
                baseImage={product.image}
                productName={product.name}
                selectedColor={selectedColor}
                defaultColor={product.colors[0]}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.isSale && (
                  <span className="bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                    OFERTA ESPECIAL
                  </span>
                )}
                {product.category === 'oversize' && (
                  <span className="bg-amber-400 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                    CORTE BOXY FIT
                  </span>
                )}
              </div>

              {/* Floating Active Color Pill on Image */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/85 text-white text-xs font-semibold backdrop-blur-md shadow-md">
                <span
                  className="w-3 h-3 rounded-full border border-white/80 shrink-0"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="truncate max-w-[150px]">{selectedColor.name}</span>
              </div>
            </div>

            {/* Interactive Color Quick Picker Strip */}
            <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Gama de colores para este artículo:
                </span>
                <span className="text-[10px] text-neutral-400">Fondo intacto</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                      selectedColor.name === c.name
                        ? 'border-neutral-900 bg-white shadow-xs scale-102 ring-1 ring-neutral-900'
                        : 'border-neutral-200 bg-white/60 hover:bg-white hover:border-neutral-300'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-neutral-300 shadow-2xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[10px] font-semibold text-neutral-700 leading-tight truncate w-full">
                      {c.name}
                    </span>
                  </button>
                ))}

                {/* Custom Color Option in Quick Picker */}
                <label
                  title="Elige cualquier tono a tu gusto (solo cambia la prenda, fondo intacto)"
                  className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 text-center cursor-pointer transition-all ${
                    selectedColor.name === 'A tu gusto'
                      ? 'border-neutral-900 bg-white shadow-xs scale-102 ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-white/60 hover:bg-white hover:border-neutral-300'
                  }`}
                >
                  <span
                    className="w-5 h-5 rounded-full border border-neutral-300 shadow-2xs shrink-0"
                    style={{
                      background:
                        'conic-gradient(from 180deg at 50% 50%, #ef4444 0deg, #f59e0b 60deg, #10b981 120deg, #06b6d4 180deg, #3b82f6 240deg, #a855f7 300deg, #ef4444 360deg)',
                    }}
                  />
                  <span className="text-[10px] font-semibold text-neutral-700 leading-tight truncate w-full">
                    A tu gusto
                  </span>
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
                    className="opacity-0 absolute w-0 h-0 pointer-events-none"
                  />
                </label>
              </div>

              <div className="pt-1 flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Solo cambia el color de la prenda u objeto. El fondo se mantiene intacto.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Selectors */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">
                  {product.category === 'oversize'
                    ? `Colección Oversize • ${product.subtheme === 'anime' ? 'Edición Anime' : product.subtheme === 'lugares' ? 'Sitios Famosos' : product.subtheme === 'famosos' ? 'Iconos Famosos' : 'Gráficos Urbanos'}`
                    : product.department || product.category}
                </span>
                {product.category === 'oversize' && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                    Gramaje 240g
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900 leading-snug mt-1">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 text-sm font-bold text-neutral-900">{product.rating}</span>
                </div>
                <span className="text-neutral-300">•</span>
                <span className="text-xs text-neutral-500">
                  {product.reviewsCount} valoraciones verificadas
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-neutral-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-base text-neutral-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selector */}
            <div className="space-y-2 pt-1 border-t border-neutral-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800">
                  Color Seleccionado: <span className="text-neutral-950 font-black">{selectedColor.name}</span>
                </span>
                <span className="text-neutral-400 text-[11px]">Toca para cambiar acabado</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => {
                  const isSelected = selectedColor.name === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs scale-102'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-400 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border ${isSelected ? 'border-white' : 'border-neutral-300'}`}
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white ml-0.5" />}
                    </button>
                  );
                })}

                {/* Custom Color Button */}
                <label
                  title="Elige cualquier tono libremente (solo cambia la prenda, fondo intacto)"
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                    selectedColor.name === 'A tu gusto'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs scale-102 ring-1 ring-neutral-900'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-400 hover:bg-white'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
                    style={{
                      background:
                        'conic-gradient(from 180deg at 50% 50%, #ef4444 0deg, #f59e0b 60deg, #10b981 120deg, #06b6d4 180deg, #3b82f6 240deg, #a855f7 300deg, #ef4444 360deg)',
                    }}
                  />
                  <span>Personalizar color</span>
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
                    className="opacity-0 absolute w-0 h-0 pointer-events-none"
                  />
                </label>
              </div>
            </div>

            {/* Size Selector & Interactive Guide */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-neutral-800">
                  Talla / Medida: <span className="text-neutral-950 font-black">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullSizeChart(!showFullSizeChart)}
                  className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{showFullSizeChart ? 'Ocultar guía' : 'Guía de medidas'}</span>
                  {showFullSizeChart ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs scale-102'
                          : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Size Details Card */}
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                  <Ruler className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span>{sizeDetail.dimensionLabel}</span>
                </div>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  {sizeDetail.description}
                </p>
                {sizeDetail.measurements && sizeDetail.measurements.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1.5 border-t border-neutral-200/60 mt-1.5">
                    {sizeDetail.measurements.map((m, idx) => (
                      <div key={idx} className="bg-white px-2 py-1 rounded-lg border border-neutral-200/60">
                        <span className="text-[10px] text-neutral-500 block">{m.label}</span>
                        <strong className="text-xs text-neutral-900 font-bold">{m.value}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Collapsible Full Size Comparison Table */}
              {showFullSizeChart && (
                <div className="p-3 bg-neutral-900 text-white rounded-2xl text-xs space-y-2 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs uppercase tracking-wider text-neutral-300">
                      Tabla comparativa de todas las tallas
                    </span>
                    <span className="text-[10px] text-neutral-400">Medidas en centímetros</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-neutral-700 text-neutral-400">
                          <th className="py-1 px-2">Talla</th>
                          <th className="py-1 px-2">Dimensiones</th>
                          <th className="py-1 px-2">Ajuste</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {product.sizes.map((sz) => {
                          const det = getSizeDetails(product.category, sz, product.department);
                          const isCurrent = sz === selectedSize;
                          return (
                            <tr
                              key={sz}
                              onClick={() => setSelectedSize(sz)}
                              className={`cursor-pointer hover:bg-neutral-800 transition-colors ${
                                isCurrent ? 'bg-neutral-800 text-amber-300 font-bold' : 'text-neutral-300'
                              }`}
                            >
                              <td className="py-1.5 px-2 font-black">{sz} {isCurrent && '✓'}</td>
                              <td className="py-1.5 px-2">{det.dimensionLabel}</td>
                              <td className="py-1.5 px-2 truncate max-w-[160px]">{det.description}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Add Button */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-200 rounded-lg"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-neutral-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2.5 py-1 text-sm font-bold text-neutral-600 hover:bg-neutral-200 rounded-lg"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                disabled={added}
                className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-md hover:shadow-lg active:scale-98'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Agregado al Carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Añadir al Carrito (${(product.price * quantity).toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust bullet features */}
            <div className="pt-3 border-t border-neutral-100 grid grid-cols-3 gap-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <span>Envío express</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <span>Pago seguro</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <span>30 días cambio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
