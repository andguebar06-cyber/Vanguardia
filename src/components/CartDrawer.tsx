import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, Truck, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { ProductImageViewer } from './ProductImageViewer';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const freeShippingThreshold = 50;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = cartItems.length === 0 ? 0 : isFreeShipping ? 0 : 4.99;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercentage = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'MODA10') {
      setDiscountPercent(10);
      setPromoMessage({ text: '¡Cupón del 10% aplicado con éxito!', isError: false });
    } else if (code === 'VERANO20') {
      setDiscountPercent(20);
      setPromoMessage({ text: '¡Cupón VIP del 20% aplicado con éxito!', isError: false });
    } else if (code === '') {
      setPromoMessage({ text: 'Por favor ingresa un código.', isError: true });
    } else {
      setPromoMessage({ text: 'Código no válido. Prueba con MODA10', isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark overlay backdrop */}
      <div
        id="cart-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-neutral-900 text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-neutral-900 leading-tight">Carrito de Compras</h2>
                <p className="text-xs text-neutral-500">
                  {cartItems.length === 0
                    ? 'Sin prendas seleccionadas'
                    : `${cartItems.reduce((c, i) => c + i.quantity, 0)} prenda(s) en total`}
                </p>
              </div>
            </div>

            <button
              id="close-cart-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="bg-amber-50/80 border-b border-amber-200/60 px-5 py-3 text-xs text-amber-900">
              <div className="flex items-center justify-between font-semibold mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-600" />
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 inline" /> ¡Tienes Envío Gratis!
                    </span>
                  ) : (
                    <span>Faltan ${amountNeededForFreeShipping.toFixed(2)} para Envío Gratis</span>
                  )}
                </span>
                <span className="font-bold">{Math.round(freeShippingPercentage)}%</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200/80 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isFreeShipping ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${freeShippingPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items Scrollable List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-neutral-900">Tu carrito está vacío</h3>
                  <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                    Añade las mejores prendas de la colección para comenzar a armar tu look.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-xs"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {cartItems.map((item) => {
                  const itemTotal = item.product.price * item.quantity;
                  return (
                    <div
                      key={item.id}
                      id={`cart-item-${item.id}`}
                      className="flex gap-3.5 p-3 rounded-2xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition-all"
                    >
                      {/* Item Thumbnail */}
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                        <ProductImageViewer
                          baseImage={item.product.image}
                          productName={item.product.name}
                          selectedColor={item.color}
                          defaultColor={item.product.colors[0]}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-neutral-400 hover:text-red-500 p-1 rounded-md transition-colors"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Selected Attributes */}
                          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded font-medium text-neutral-700">
                              Talla: {item.size}
                            </span>
                            <span className="flex items-center gap-1 bg-neutral-100 px-2 py-0.5 rounded font-medium text-neutral-700">
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block border border-neutral-300"
                                style={{ backgroundColor: item.color.hex }}
                              />
                              {item.color.name}
                            </span>
                          </div>
                        </div>

                        {/* Price and Quantity Adjuster */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1.5 hover:bg-neutral-200 text-neutral-700 transition-colors"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-3 text-xs font-bold text-neutral-900 min-w-[28px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1.5 hover:bg-neutral-200 text-neutral-700 transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-neutral-900">
                              ${itemTotal.toFixed(2)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="block text-[10px] text-neutral-400">
                                (${item.product.price.toFixed(2)} c/u)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Empty Entire Cart Option */}
                <div className="text-right pt-1">
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-xs text-neutral-400 hover:text-red-600 transition-colors inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Vaciar todo el carrito
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Panel */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-neutral-50/80 space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Código de cupón (Ej: MODA10)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs uppercase bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 transition-colors shrink-0"
                  >
                    Aplicar
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] font-medium flex items-center gap-1 ${
                      promoMessage.isError ? 'text-red-600' : 'text-emerald-600'
                    }`}
                  >
                    {!promoMessage.isError && <Sparkles className="w-3 h-3 inline" />}
                    {promoMessage.text}
                  </p>
                )}
              </form>

              {/* Order Summary Calculations */}
              <div className="space-y-2 text-xs border-t border-neutral-200 pt-3 text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Descuento ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Costo de Envío</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-semibold uppercase text-[11px]">Gratis</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total a Pagar</span>
                  <span className="text-base font-black">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to checkout CTA */}
              <button
                id="checkout-cta-btn"
                type="button"
                onClick={onCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                <span>Proceder al Pago Seguro</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-neutral-400">
                Transacción segura cifrada SSL • 30 días de garantía
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
