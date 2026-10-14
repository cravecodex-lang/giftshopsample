import { Search, ShoppingBag, X } from 'lucide-react';

const SearchOverlay = ({ isOpen, query, setQuery, results, onClose, onQuickView, onAddToBag }) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-[#183B56]/35 backdrop-blur-[3px] transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-x-0 top-0 z-[60] mx-auto max-w-4xl p-3 transition duration-300 sm:p-5 ${isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-10 opacity-0'}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex max-h-[calc(100dvh-1.5rem)] flex-col rounded-[30px] border border-white/30 bg-[#FFFCF7]/92 p-4 shadow-[0_30px_80px_rgba(5,22,36,0.18)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 border-b border-[#E5EDF4] pb-4">
            <div className="flex flex-1 items-center gap-3 rounded-full bg-[#F5FAFD] px-4 py-3 text-[#183B56]">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search gifts, occasions, keepsakes..."
                className="w-full border-0 bg-transparent text-sm text-[#183B56] outline-none placeholder:text-[#5d7383]"
              />
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-[#D9E7EF] p-2 text-[#183B56]">
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 min-h-0 flex-1 space-y-3 overflow-y-auto">
            {results.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#D9E7EF] bg-[#F7FBFF] p-6 text-center text-sm text-[#5d7383]">
                No results found. Try a different phrase like “personalized”, “hamper”, or “wedding”.
              </div>
            ) : (
              results.map((product) => (
                <div key={product.id} className="flex flex-wrap items-center gap-3 rounded-[22px] border border-[#EDEFF3] bg-white p-2.5 sm:flex-nowrap sm:gap-4 sm:p-3">
                  <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20 sm:rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight text-[#183B56] sm:text-2xl">{product.name}</p>
                    <p className="mt-1 text-sm text-[#5d7383]">From ₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex w-full justify-end gap-2 sm:w-auto">
                    <button type="button" onClick={() => onQuickView(product)} className="rounded-full border border-[#D9E7EF] px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#183B56]">
                      Quick View
                    </button>
                    <button type="button" onClick={() => onAddToBag(product)} className="inline-flex items-center gap-2 rounded-full bg-[#183B56] px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white">
                      <ShoppingBag size={14} />
                      Add
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
