import { useEffect, useRef } from 'react';
import { ChevronRight, Search, ShoppingBag, X } from 'lucide-react';

const recipientSuggestions = [
  { title: 'Him', image: '/category-boys.png', query: 'hamper' },
  { title: 'Her', image: '/category-women.png', query: 'flower' },
  { title: 'Kids', image: '/category-kids.png', query: 'teddy' },
  { title: 'Friend', image: '/gift-boy.png', query: 'birthday' },
  { title: 'Wife', image: '/category-anniversary.png', query: 'anniversary' },
  { title: 'Mother', image: '/category-women.png', query: 'flower' },
];

const occasionSuggestions = [
  { title: "Men's Day", image: '/category-boys.png', query: 'hamper' },
  { title: 'Birthday', image: '/Elegant Blue and Gold Birthday Celebration-9.png', query: 'birthday' },
  { title: 'Anniversary', image: '/Blue Anniversary Gift with Roses-8.png', query: 'anniversary' },
  { title: 'Congratulations', image: '/gift-box-3d.png', query: 'personalized' },
];

const SearchOverlay = ({ isOpen, query, setQuery, results, onClose, onQuickView, onPersonalize, onAddToBag }) => {
  const searchInputRef = useRef(null);
  const recipientTrackRef = useRef(null);

  useEffect(() => {
    if (isOpen) searchInputRef.current?.focus();
  }, [isOpen]);

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
                ref={searchInputRef}
                aria-label="Search gifts"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search gifts, occasions, keepsakes..."
                className="w-full border-0 bg-transparent text-sm text-[#183B56] outline-none placeholder:text-[#5d7383]"
              />
            </div>
            <button type="button" onClick={onClose} aria-label="Close search" className="rounded-full border border-[#D9E7EF] p-2 text-[#183B56]">
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
            {!query.trim() ? (
              <div className="space-y-6 pb-1">
                <section aria-labelledby="gift-recipients-heading">
                  <div className="flex items-center justify-between">
                    <h2 id="gift-recipients-heading" className="text-base font-semibold text-[#183B56] sm:text-lg">Gifts for Everyone</h2>
                  </div>
                  <div className="relative mt-3">
                    <div ref={recipientTrackRef} className="flex gap-3 overflow-x-auto pb-2 sm:gap-4" style={{ scrollbarWidth: 'none' }}>
                      {recipientSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.title}
                          type="button"
                          onClick={() => setQuery(suggestion.query)}
                          aria-label={`Find gifts for ${suggestion.title}`}
                          className="w-28 shrink-0 text-center sm:w-[calc((100%-4rem)/5)]"
                        >
                          <span className="block h-20 overflow-hidden rounded-[14px] bg-[#F8EEF1] sm:h-24">
                            <img src={suggestion.image} alt="" className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                          </span>
                          <span className="mt-2 block text-sm font-medium text-[#273746]">{suggestion.title}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => recipientTrackRef.current?.scrollBy({ left: 220, behavior: 'smooth' })}
                      aria-label="Show more gift recipients"
                      className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E7EA] bg-white/95 text-[#183B56] shadow-sm transition hover:bg-[#F5FAFD]"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </section>

                <section aria-labelledby="gift-occasions-heading">
                  <h2 id="gift-occasions-heading" className="text-base font-semibold text-[#183B56] sm:text-lg">Gifts For Every Occasion</h2>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    {occasionSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.title}
                        type="button"
                        onClick={() => setQuery(suggestion.query)}
                        className="group relative aspect-[1.65] overflow-hidden rounded-[15px] text-left"
                      >
                        <img src={suggestion.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        <span className="absolute inset-0 bg-gradient-to-b from-[#071B2D]/50 via-transparent to-[#071B2D]/10" />
                        <span className="absolute left-3 top-2 text-xs font-medium text-white drop-shadow sm:text-sm">{suggestion.title} ›</span>
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#D9E7EF] bg-[#F7FBFF] p-6 text-center text-sm text-[#5d7383]">
                No results found. Try a different phrase like “personalized”, “hamper”, or “wedding”.
              </div>
            ) : (
              <div className="space-y-3 pb-1">
                {results.map((product) => (
                  <div key={product.id} className="flex flex-wrap items-center gap-3 rounded-[22px] border border-[#EDEFF3] bg-white p-2.5 sm:flex-nowrap sm:gap-4 sm:p-3">
                    <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20 sm:rounded-2xl" />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg leading-tight text-[#183B56] sm:text-2xl">{product.name}</p>
                      <p className="mt-1 text-sm text-[#5d7383]">From ₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex w-full justify-end gap-2 sm:w-auto">
                      <button type="button" onClick={() => (product.personalized ? onPersonalize(product) : onQuickView(product))} className="rounded-full border border-[#D9E7EF] px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#183B56]">
                        {product.personalized ? 'Customize' : 'Quick View'}
                      </button>
                      <button type="button" onClick={() => (product.personalized ? onPersonalize(product) : onAddToBag(product))} className="inline-flex items-center gap-2 rounded-full bg-[#183B56] px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-white">
                        {product.personalized ? <span>Personalize</span> : <><ShoppingBag size={14} />Add</>}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
