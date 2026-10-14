import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product, isWishlisted, onToggleWishlist, onAddToBag, animationDelay = 0 }) => {
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      whileHover={{ y: -8 }}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#E7EFF4] bg-white shadow-[0_24px_60px_rgba(12,36,52,0.06)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#183B56] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[#183B56] backdrop-blur-sm transition hover:scale-105"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={isWishlisted ? 'fill-[#183B56] text-[#183B56]' : ''} size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[#5d7383]">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em]">{product.category}</span>
          <div className="flex items-center gap-1 text-[#D6B77A]">
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" className="opacity-40" />
          </div>
        </div>

        <h3 className="min-h-[4.1rem] font-display text-[1.7rem] leading-tight text-[#183B56]">{product.name}</h3>

        <div className="mt-4 flex min-h-8 flex-wrap items-center gap-3">
          <span className="text-xl font-semibold text-[#183B56]">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice ? (
            <>
              <span className="text-sm text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              <span className="rounded-full bg-[#EAF7FC] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#183B56]">
                {discount}% OFF
              </span>
            </>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-8">
          <button
            type="button"
            onClick={() => onToggleWishlist(product.id)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D9E7EF] bg-white text-[#183B56] transition hover:border-[#87CEEB] hover:text-[#087CC1]"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} className={isWishlisted ? 'fill-[#183B56] text-[#183B56]' : ''} />
          </button>
          <button
            type="button"
            onClick={() => onAddToBag(product)}
            className="inline-flex h-12 min-w-[150px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#183B56] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#234d72]"
          >
            <ShoppingCart size={16} />
            Add to Bag
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
