import { Heart, ShoppingCart, X } from 'lucide-react';

const WishlistDrawer = ({ isOpen, items, onClose, onRemove, onAddToBag }) => (
  <>
    <div
      className={`fixed inset-0 z-40 bg-[#183B56]/30 backdrop-blur-[2px] transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      onClick={onClose}
    />
    <aside
      className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#FFFCF7] shadow-[0_40px_80px_rgba(24,59,86,0.25)] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      aria-label="Wishlist"
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between border-b border-[#E9EDF1] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7FC] text-[#183B56]">
            <Heart size={18} />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6a8194]">Saved for later</p>
            <h3 className="font-display text-2xl text-[#183B56]">Wishlist ({items.length})</h3>
          </div>
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-[#D9E7EF] p-2 text-[#183B56]" aria-label="Close wishlist">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-[28px] border border-dashed border-[#D9E7EF] bg-[#F9FCFE] p-6 text-center">
            <p className="font-display text-3xl text-[#183B56]">Your wishlist is empty</p>
            <p className="mt-3 text-sm text-[#5d7383]">Tap the heart on a gift to save it here.</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-3 rounded-[24px] border border-[#EAEFF4] bg-white p-3 shadow-[0_15px_35px_rgba(22,53,78,0.04)]">
              <img src={item.image} alt={item.name} className="h-24 w-20 rounded-2xl object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#183B56]">{item.name}</p>
                    <p className="mt-1 text-xs text-[#6a8194]">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <button type="button" onClick={() => onRemove(item.id)} className="text-xs font-medium text-[#6a8194] underline">
                    Remove
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToBag(item)}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-[#183B56] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#234d72]"
                >
                  <ShoppingCart size={14} />
                  Add to Bag
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  </>
);

export default WishlistDrawer;
