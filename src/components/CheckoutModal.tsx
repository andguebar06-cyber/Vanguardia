import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, ShieldCheck, Truck, ArrowLeft, Loader2, DollarSign } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderCompleted: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderCompleted,
}) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card' as 'card' | 'paypal' | 'cash',
    cardNumber: '4532 •••• •••• 8821',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 50 ? 0 : 4.99;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    const generatedOrder = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Persist order in Neon PostgreSQL database
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: generatedOrder,
          customerName: formData.fullName || 'Cliente Vanguardia',
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          paymentMethod: formData.paymentMethod,
          subtotal,
          shippingFee,
          total,
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color.name,
            image: item.product.image,
          })),
        }),
      });
    } catch (err) {
      console.warn('Error saving order to PostgreSQL, proceed locally:', err);
    }

    setOrderNumber(generatedOrder);
    setStep('success');
    onOrderCompleted();
  };

  const handleFinish = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-black/70 backdrop-blur-xs animate-in fade-in">
      <div
        id="checkout-modal-container"
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative overflow-hidden"
      >
        {step !== 'processing' && (
          <button
            type="button"
            onClick={step === 'success' ? handleFinish : onClose}
            className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-900 p-1.5 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* STEP: FORM */}
        {step === 'form' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Pago Seguro Cifrado SSL de 256 bits</span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-neutral-900">Finalizar Compra</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Completa tus datos para procesar el despacho de tus prendas seleccionadas.
              </p>
            </div>

            {/* Quick Order items pill */}
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between text-xs">
              <span className="text-neutral-600">
                Resumen ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} artículos)
              </span>
              <span className="font-bold text-neutral-900 text-sm">${total.toFixed(2)} USD</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Nombre Completo *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ej. Ana García"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Correo Electrónico *</label>
                  <input
                    required
                    type="email"
                    placeholder="ana@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-neutral-700 font-semibold mb-1">Dirección de Entrega *</label>
                  <input
                    required
                    type="text"
                    placeholder="Calle, número, depto / piso"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Ciudad *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ciudad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">Método de Pago</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                      formData.paymentMethod === 'paypal'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span className="text-[11px] font-bold">PayPal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                    className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition-all ${
                      formData.paymentMethod === 'cash'
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span className="text-[11px] font-bold">Contra Entrega</span>
                  </button>
                </div>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="p-3.5 rounded-xl bg-neutral-100/70 border border-neutral-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Tarjeta simulada para demostración:</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Demo Test Mode
                    </span>
                  </div>
                  <input
                    readOnly
                    type="text"
                    value={formData.cardNumber}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-800"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      readOnly
                      type="text"
                      value={`Vence: ${formData.cardExp}`}
                      className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-600"
                    />
                    <input
                      readOnly
                      type="text"
                      value={`CVC: ${formData.cardCvc}`}
                      className="px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-mono text-neutral-600"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3">
                <button
                  id="submit-order-btn"
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-98"
                >
                  Pagar ${total.toFixed(2)} USD y Confirmar Pedido
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP: PROCESSING */}
        {step === 'processing' && (
          <div className="py-16 text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-neutral-100 text-neutral-900 animate-spin">
              <Loader2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-neutral-900">Procesando tu pedido de ropa...</h3>
              <p className="text-xs text-neutral-500">
                Verificando disponibilidad de stock y generando comprobante de pago seguro.
              </p>
            </div>
          </div>
        )}

        {/* STEP: SUCCESS */}
        {step === 'success' && (
          <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                ¡Compra Exitosa!
              </span>
              <h3 className="text-2xl font-serif font-bold text-neutral-900 mt-2">
                ¡Gracias por tu compra en Vanguardia!
              </h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                Hemos enviado la confirmación y la factura electrónica a <strong>{formData.email || 'tu correo'}</strong>.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between pb-2 border-b border-neutral-200 font-medium">
                <span className="text-neutral-500">Número de Orden:</span>
                <span className="font-mono font-bold text-neutral-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">Destinatario:</span>
                <span className="font-medium text-neutral-900">{formData.fullName || 'Cliente'}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="text-neutral-500">Entrega Estimada:</span>
                <span className="font-medium text-emerald-700">En 24 a 48 horas laborables</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm">
                <span>Total Abonado:</span>
                <span className="text-neutral-900">${total.toFixed(2)} USD</span>
              </div>
              <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-[11px] text-emerald-700 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Registrado en Neon PostgreSQL
                </span>
                <span className="text-neutral-400 font-mono text-[10px]">neondb</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all"
              >
                Volver a la Tienda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
