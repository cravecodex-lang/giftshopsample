import { ArrowLeft, Minus, Plus, ShoppingBag, X } from 'lucide-react';

const CartDrawer = ({ isOpen, items, onClose, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-[#183B56]/30 backdrop-blur-[2px] transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#FFFCF7] shadow-[0_40px_80px_rgba(24,59,86,0.25)] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between bg-[#102D44] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-[#87CEEB]">
              <ShoppingBag size={19} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a9cbdd]">A little joy awaits</p>
              <h3 className="font-display text-2xl text-white">Your bag <span className="font-sans text-sm text-[#a9cbdd]">({itemCount})</span></h3>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/20 p-2 text-white transition hover:bg-white/10" aria-label="Close bag">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-[#F8FBFD] p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-[28px] border border-dashed border-[#D9E7EF] bg-white p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7FC] text-[#183B56]"><ShoppingBag size={22} /></div>
              <p className="mt-4 font-display text-3xl text-[#183B56]">Your bag is empty</p>
              <p className="mt-3 text-sm leading-6 text-[#5d7383]">Add a few meaningful pieces to begin your gifting story.</p>
              <button type="button" onClick={onClose} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#183B56]">
                <ArrowLeft size={15} />
                Continue shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-[24px] border border-[#EAEFF4] bg-white p-3 shadow-[0_15px_35px_rgba(22,53,78,0.05)]">
                <img src={item.image} alt={item.name} className="h-28 w-24 rounded-2xl object-cover" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-display text-lg leading-tight text-[#183B56]">{item.name}</p>
                      <p className="mt-1 text-xs text-[#6a8194]">₹{item.price.toLocaleString('en-IN')} each</p>
                    </div>
                    <button type="button" onClick={() => onRemoveItem(item.id)} className="h-fit text-xs font-medium text-[#6a8194] underline">
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#D9E7EF] bg-[#FBFDFF] px-2 py-1">
                      <button type="button" onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 text-[#183B56]" aria-label={`Decrease ${item.name} quantity`}>
                        <Minus size={14} />
                      </button>
                      <span className="min-w-6 text-center text-sm font-medium text-[#183B56]">{item.quantity}</span>
                      <button type="button" onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 text-[#183B56]" aria-label={`Increase ${item.name} quantity`}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-[#183B56]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-[#E9EDF1] bg-white p-5">
          <div className="mb-3 flex items-center justify-between text-sm text-[#5d7383]">
            <span>Delivery</span>
            <span className="font-medium text-[#087CC1]">Complimentary</span>
          </div>
          <div className="mb-4 flex items-center justify-between border-t border-[#EEF2F5] pt-3 text-[#183B56]">
            <span className="text-sm text-[#5d7383]">Subtotal</span>
            <span className="text-2xl font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <button type="button" onClick={onCheckout} disabled={items.length === 0} className="w-full rounded-full bg-[#183B56] px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_rgba(24,59,86,0.18)] transition hover:bg-[#234d72] disabled:cursor-not-allowed disabled:opacity-50">
            Secure checkout
          </button>
          <p className="mt-3 text-center text-[11px] text-[#7d8f9d]">Thoughtfully packed · Complimentary delivery</p>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
