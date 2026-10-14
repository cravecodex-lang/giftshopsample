import { X, ShoppingBag } from 'lucide-react';

const QuickViewModal = ({ product, onClose, onAddToBag }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#183B56]/45 p-4 backdrop-blur-sm">
      <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto rounded-[24px] bg-[#FFFCF7] shadow-[0_30px_120px_rgba(17,39,59,0.22)] sm:rounded-[32px]">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 z-10 rounded-full border border-[#DCEAF3] bg-white p-2 text-[#183B56]">
          <X size={18} />
        </button>
        <div className="grid md:grid-cols-2">
          <img src={product.image} alt={product.name} className="h-56 w-full object-cover sm:h-72 md:h-full md:min-h-[360px]" />
          <div className="p-5 sm:p-6 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5d7383]">{product.category}</p>
            <h3 className="mt-3 font-display text-3xl text-[#183B56] sm:text-4xl">{product.name}</h3>
            <div className="mt-5 flex items-center gap-4">
              <span className="text-3xl font-semibold text-[#183B56]">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice ? (
                <span className="text-lg text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              ) : null}
            </div>
            <p className="mt-5 text-base leading-7 text-[#4a6478]">
              Crafted to make every moment feel thoughtfully celebrated — with premium detailing, elegant presentation, and a gift experience designed to be remembered.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={() => onAddToBag(product)} className="inline-flex items-center gap-2 rounded-full bg-[#183B56] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-white">
                <ShoppingBag size={16} />
                Add to Bag
              </button>
              <button type="button" onClick={onClose} className="rounded-full border border-[#D9E7EF] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#183B56]">
                Continue Shopping
              </button>
            </div>
            <div className="mt-8 rounded-[24px] bg-[#EAF7FC] p-4 text-sm text-[#183B56]">
              Premium gift wrapping available • Ready to ship within 48 hours
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
