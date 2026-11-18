import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, ArrowRight, Heart, Search, ShoppingBag, Sparkles, Star, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PersonalizedProductCustomization, { ProductPreview } from './PersonalizedProductCustomization';
import { personalizedCategories, personalizedProducts } from '../data/personalizedData';

const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

function ProductQuickView({ product, onClose, onCustomize }) {
  if (!product) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#071B2D]/75 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="personalized-quick-view-title" className="relative grid max-h-[calc(100dvh-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-[#FFFCF7] shadow-[0_32px_90px_rgba(2,18,34,0.42)] sm:grid-cols-2">
        <button type="button" onClick={onClose} aria-label="Close quick view" className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-[#153B60] shadow-sm">
          <X size={18} />
        </button>
        <img src={product.image} alt={product.name} className="h-56 w-full object-cover sm:h-full sm:min-h-[380px]" />
        <div className="flex flex-col p-5 sm:p-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7390A6]">{product.category}</p>
          <h2 id="personalized-quick-view-title" className="mt-3 font-display text-3xl leading-tight text-[#153B60]">{product.name}</h2>
          <div className="mt-4 flex items-center gap-2 text-sm text-[#9A793F]">
            <Star size={15} fill="currentColor" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-[#71869A]">({product.reviewCount} reviews)</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-[#587186]">{product.description}</p>
          <p className="mt-5 text-2xl font-semibold text-[#153B60]">{formatPrice(product.price)}</p>
          {product.originalPrice && <p className="mt-1 text-sm text-[#8293A0] line-through">{formatPrice(product.originalPrice)}</p>}
          <button type="button" onClick={() => onCustomize(product)} className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#153B60] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#214D73]">
            <Sparkles size={16} />
            Customize this gift
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

function PersonalizedProductCard({ product, isWishlisted, onToggleWishlist, onQuickView, onCustomize }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-[26px] border border-[#E3EAF0] bg-white shadow-[0_18px_48px_rgba(21,59,96,0.07)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#EAF2F8]">
        <Link to={`/personalized/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        </Link>
        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#153B60] shadow-sm">{product.badge}</span>}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#153B60] shadow-sm transition hover:scale-105"
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7890A2]">{product.category}</p>
        <Link to={`/personalized/${product.id}`} className="mt-2 block font-display text-xl leading-tight text-[#153B60] hover:text-[#28709A] sm:text-2xl">{product.name}</Link>
        <div className="mt-3 flex items-center gap-2 text-xs text-[#9A793F]">
          <Star size={14} fill="currentColor" />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-[#8192A0]">({product.reviewCount})</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-lg font-semibold text-[#153B60]">{formatPrice(product.price)}</span>
          {product.originalPrice && <span className="text-xs text-[#8B9AA7] line-through">{formatPrice(product.originalPrice)}</span>}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => onQuickView(product)} className="min-h-10 rounded-full border border-[#D5E2EC] px-3 text-xs font-semibold text-[#153B60] transition hover:bg-[#F1F7FB]">Quick View</button>
          <button type="button" onClick={() => onCustomize(product)} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#153B60] px-3 text-xs font-semibold text-white transition hover:bg-[#214D73]">
            <ShoppingBag size={14} />
            Customize
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function PersonalizedGiftsContent({ wishlistIds, onToggleWishlist, onAddToBag, onBuyNow }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [savedCustomizations, setSavedCustomizations] = useState({});
  const selectedProductId = location.pathname.startsWith('/personalized/')
    ? location.pathname.split('/')[2]
    : '';
  const selectedProduct = personalizedProducts.find((product) => product.id === selectedProductId);
  const selectedCategoryId = new URLSearchParams(location.search).get('category') || 'all';

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return personalizedProducts
      .filter((product) => {
        if (selectedCategoryId !== 'all') {
          const menuCategory = personalizedProducts.find((item) => item.menuCategoryId === selectedCategoryId);
          const matchesMenuCategory = product.menuCategoryId === selectedCategoryId;
          const matchesProductCategory = product.categoryId === selectedCategoryId;
          if (!menuCategory && !matchesProductCategory) return false;
          if (menuCategory && !matchesMenuCategory) return false;
        }
        return !term || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(term);
      })
      .sort((first, second) => {
        if (sortBy === 'price-low') return first.price - second.price;
        if (sortBy === 'price-high') return second.price - first.price;
        if (sortBy === 'rating') return second.rating - first.rating;
        return (second.badge ? 1 : 0) - (first.badge ? 1 : 0) || second.rating - first.rating;
      });
  }, [searchTerm, selectedCategoryId, sortBy]);

  const selectCategory = (categoryId) => {
    navigate(categoryId === 'all' ? '/personalized' : `/personalized?category=${encodeURIComponent(categoryId)}`);
    window.setTimeout(() => document.getElementById('personalized-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  const openProduct = (product) => {
    setQuickViewProduct(null);
    navigate(`/personalized/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (location.pathname.startsWith('/personalized/')) {
    if (!selectedProduct) {
      return (
        <section className="mx-auto max-w-7xl px-4 py-14 text-center sm:py-20 lg:px-8">
          <p className="text-sm text-[#69839A]">We couldn&apos;t find that personalized gift.</p>
          <Link to="/personalized" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#153B60] px-5 py-3 text-sm font-semibold text-white"><ArrowLeft size={16} />Back to personalized gifts</Link>
        </section>
      );
    }

    return (
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-8">
        <Link to="/personalized" className="inline-flex items-center gap-2 text-sm font-semibold text-[#456B87] transition hover:text-[#153B60]"><ArrowLeft size={16} />All personalized gifts</Link>
        <div className="mt-6 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_70px_rgba(21,59,96,0.12)]">
            {savedCustomizations[selectedProduct.id] ? (
              <ProductPreview
                key={`${selectedProduct.id}-saved-preview`}
                product={selectedProduct}
                {...savedCustomizations[selectedProduct.id]}
                isHero
              />
            ) : (
              <img src={selectedProduct.image} alt={selectedProduct.name} className="aspect-[4/3] w-full object-cover lg:aspect-[4/5]" />
            )}
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7890A2]">{selectedProduct.category}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-[#153B60] sm:text-5xl">{selectedProduct.name}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-[#A9874D]"><Star size={16} fill="currentColor" /><span className="font-semibold">{selectedProduct.rating}</span><span className="text-[#7890A2]">· {selectedProduct.reviewCount} reviews</span></div>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-semibold text-[#153B60]">{formatPrice(selectedProduct.price)}</span>
              {selectedProduct.originalPrice && <span className="text-sm text-[#8998A4] line-through">{formatPrice(selectedProduct.originalPrice)}</span>}
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#587186]">{selectedProduct.description}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-[#456B87]">
              {['Gift-ready packaging', 'Made with care', 'Personalized for you'].map((benefit) => <span key={benefit} className="rounded-full border border-[#D8E5EF] bg-white px-3 py-2">{benefit}</span>)}
            </div>
            <div className="mt-8 scroll-mt-32" id="customize-gift">
              <PersonalizedProductCustomization
                key={selectedProduct.id}
                product={selectedProduct}
                onAddToBag={onAddToBag}
                onBuyNow={onBuyNow}
                onSave={(customization) => setSavedCustomizations((current) => ({
                  ...current,
                  [selectedProduct.id]: customization,
                }))}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:pb-12 sm:pt-8 lg:px-8">
        <div className="relative isolate grid min-h-[360px] overflow-hidden rounded-[30px] bg-[linear-gradient(120deg,#102D44_0%,#153B60_58%,#286287_100%)] shadow-[0_28px_75px_rgba(21,59,96,0.18)] sm:min-h-[430px] sm:rounded-[38px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 flex flex-col items-start justify-center p-6 text-white sm:p-10 lg:p-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#B9D9F5] sm:text-xs">Made for your moments</p>
            <h1 className="mt-4 max-w-[13ch] font-display text-[clamp(2.5rem,7vw,4.7rem)] leading-[1.04]">Make It Personal, Make It Special</h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-[#E3F0F8] sm:text-base sm:leading-7">Turn your special moments into unforgettable gifts.</p>
            <a href="#personalized-products" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#F6F0E7] px-6 py-3 text-sm font-semibold text-[#153B60] shadow-lg transition hover:-translate-y-0.5 hover:bg-white">
              Explore Personalized Gifts
              <ArrowRight size={17} />
            </a>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#D8E9F4]">
              <span>Thoughtful keepsakes</span>
              <span>Personalized by you</span>
              <span>Gift-ready</span>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 -z-0 w-full opacity-35 lg:relative lg:w-auto lg:opacity-100">
            <img src="/Blue%20Gift%20Ideas%20Collection-6.png" alt="A curated collection of personalized gifts" className="h-full w-full object-cover object-center lg:rounded-l-[120px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#102D44] via-[#102D44]/30 to-transparent lg:from-transparent lg:via-[#102D44]/5 lg:to-[#102D44]/10" />
          </div>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7890A2]">Find their kind of special</p>
              <h2 className="mt-2 font-display text-3xl text-[#153B60] sm:text-4xl">Shop by Category</h2>
            </div>
            <button type="button" onClick={() => selectCategory('all')} className="text-sm font-semibold text-[#456B87] hover:text-[#153B60]">View all gifts</button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 xl:grid-cols-9">
            {personalizedCategories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              return (
                <button key={category.id} type="button" onClick={() => selectCategory(category.id)} aria-pressed={isSelected} className={`group overflow-hidden rounded-[20px] border bg-[#F8FAFC] text-left transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(21,59,96,0.12)] ${isSelected ? 'border-[#153B60] ring-2 ring-[#153B60]/10' : 'border-[#E2EAF0]'}`}>
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={category.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-3">
                    <span className="block text-xs font-semibold leading-4 text-[#153B60] sm:text-sm">{category.title}</span>
                    <span className="mt-1 hidden text-[10px] leading-4 text-[#71869A] xl:block">{category.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="personalized-products" className="scroll-mt-28 bg-[#F7FAFC] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7890A2]">Picked with a personal touch</p>
              <h2 className="mt-2 font-display text-3xl text-[#153B60] sm:text-4xl">{selectedCategoryId === 'all' ? 'Personalized Best Sellers' : 'Find Their Perfect Keepsake'}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#71869A]">Small details, meaningful memories, and gifts made to feel like theirs.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex min-h-11 items-center gap-2 rounded-full border border-[#D5E1EA] bg-white px-4 text-[#71869A]">
                <Search size={16} />
                <span className="sr-only">Search personalized gifts</span>
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search personalized gifts" className="w-full min-w-0 bg-transparent text-sm text-[#153B60] outline-none placeholder:text-[#8999A6] sm:w-52" />
              </label>
              <label className="sr-only" htmlFor="personalized-sort">Sort personalized gifts</label>
              <select id="personalized-sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-h-11 rounded-full border border-[#D5E1EA] bg-white px-4 text-sm text-[#234B6B] outline-none focus:border-[#4A8DB6]">
                <option value="featured">Featured</option>
                <option value="rating">Top rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <button type="button" onClick={() => selectCategory('all')} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${selectedCategoryId === 'all' ? 'bg-[#153B60] text-white' : 'border border-[#D5E1EA] bg-white text-[#456B87] hover:bg-[#EEF5FA]'}`}>All gifts</button>
            {personalizedCategories.map((category) => (
              <button key={category.id} type="button" onClick={() => selectCategory(category.id)} aria-pressed={selectedCategoryId === category.id} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${selectedCategoryId === category.id ? 'bg-[#153B60] text-white' : 'border border-[#D5E1EA] bg-white text-[#456B87] hover:bg-[#EEF5FA]'}`}>
                {category.title}
              </button>
            ))}
          </div>

          {filteredProducts.length ? (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <PersonalizedProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                  onQuickView={setQuickViewProduct}
                  onCustomize={openProduct}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[26px] border border-dashed border-[#C7D7E3] bg-white px-6 py-12 text-center">
              <Search size={24} className="mx-auto text-[#7890A2]" />
              <h3 className="mt-4 font-display text-2xl text-[#153B60]">No gifts match that search</h3>
              <p className="mt-2 text-sm text-[#71869A]">Try another product name or choose a different category.</p>
              <button type="button" onClick={() => { setSearchTerm(''); selectCategory('all'); }} className="mt-5 rounded-full bg-[#153B60] px-5 py-2.5 text-sm font-semibold text-white">Clear filters</button>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-5 rounded-[26px] bg-[linear-gradient(120deg,#EAF3F8,#F7F1E8)] p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7890A2]">A gift made just for them</p>
            <h2 className="mt-2 font-display text-2xl text-[#153B60] sm:text-3xl">Add a name, a photo, and a little meaning.</h2>
          </div>
          <Link to="/personalized/personalized-photo-mug" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#153B60] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#214D73]">Create a gift <ArrowRight size={16} /></Link>
        </div>
      </section>

      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onCustomize={openProduct} />
    </div>
  );
}

export default PersonalizedGiftsContent;
