import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CartDrawer from '../components/CartDrawer';
import Logo from '../components/Logo';
import QuickViewModal from '../components/QuickViewModal';
import SearchOverlay from '../components/SearchOverlay';
import WishlistDrawer from '../components/WishlistDrawer';
import { getProductImage } from '../data/productImages';
import './CategoriesPage.css';

const giftCategories = [
  {
    id: 'birthday',
    title: 'Birthday Gifts',
    subtitle: 'Make their day unforgettable.',
    image: '/category-birthday.png',
  },
  {
    id: 'anniversary',
    title: 'Anniversary Gifts',
    subtitle: 'Celebrate a love that keeps growing.',
    image: '/category-anniversary.png',
  },
  {
    id: 'wedding',
    title: 'Wedding Gifts',
    subtitle: 'For the beginning of forever.',
    image: '/category-wedding.png',
  },
  {
    id: 'women',
    title: 'Women Gifts',
    subtitle: 'Beautifully thoughtful gifts for her.',
    image: '/category-women.png',
  },
  {
    id: 'boys',
    title: 'Boys Gifts',
    subtitle: 'Fun surprises for the boys in your life.',
    image: '/category-boys.png',
  },
  {
    id: 'kids',
    title: 'Kids Gifts',
    subtitle: 'Little gifts for big smiles.',
    image: '/category-kids.png',
  },
  {
    id: 'return-gifts',
    title: 'Return Gifts',
    subtitle: 'Thank your guests with a lovely keepsake.',
    image: '/category-return-gifts.png',
  },
  {
    id: 'hampers',
    title: 'Hampers',
    subtitle: 'A little of everything, beautifully packed.',
    image: '/category-hampers.png',
  },
];

const categoryProductIds = {
  birthday: ['birthday-box', 'luxury-hamper', 'chocolate-box', 'teddy-bear', 'flower-bouquet'],
  anniversary: ['flower-bouquet', 'photo-frame', 'candle-set', 'luxury-hamper', 'chocolate-box'],
  wedding: ['luxury-hamper', 'flower-bouquet', 'photo-frame', 'candle-set', 'name-gift'],
  women: ['photo-frame', 'flower-bouquet', 'name-gift', 'candle-set', 'luxury-hamper'],
  boys: ['teddy-bear', 'birthday-box', 'chocolate-box', 'name-gift'],
  kids: ['teddy-bear', 'birthday-box', 'chocolate-box'],
  'return-gifts': ['chocolate-box', 'name-gift', 'candle-set', 'teddy-bear', 'flower-bouquet', 'birthday-box'],
  hampers: ['luxury-hamper', 'birthday-box', 'chocolate-box', 'flower-bouquet'],
};

const navigationLinks = [
  { label: 'Home', to: '/' },
  { label: 'Categories', to: '/categories' },
  { label: 'Shop All', to: '/#featured-products' },
  { label: 'Contact Us', to: '/#contact' },
];

function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToBag, onViewProduct, prefersReducedMotion }) {
  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4 }}
      whileHover={prefersReducedMotion ? undefined : { y: -5 }}
      className="group overflow-hidden rounded-[26px] border border-[#dce9f5] bg-white shadow-[0_18px_48px_rgba(21,59,96,0.07)]"
    >
      <div className="relative overflow-hidden bg-[#eaf4fd]">
        <img
          src={getProductImage(product)}
          alt={product.name}
          loading="lazy"
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
        />
        {product.badge ? (
          <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#153b60] backdrop-blur">
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => onToggleWishlist(product.id)}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isWishlisted}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 ${isWishlisted ? 'text-[#153b60]' : 'text-[#49677f]'}`}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7792a9]">{product.category}</p>
        <h3 className="mt-2 min-h-[3.2rem] font-display text-[1.45rem] leading-tight text-[#153b60] sm:text-[1.6rem]">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-lg font-semibold text-[#153b60]">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice ? (
            <span className="text-sm text-[#8ba0b1] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          ) : null}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewProduct({ ...product, image: getProductImage(product) })}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full border border-[#dce9f5] bg-[#f7fbff] px-3 text-xs font-semibold text-[#153b60] transition hover:border-[#b9d9f5] hover:bg-[#edf6ff]"
          >
            <Eye size={15} />
            View Product
          </button>
          <button
            type="button"
            onClick={() => onAddToBag({ ...product, image: getProductImage(product) })}
            aria-label={`Add ${product.name} to bag`}
            title="Add to bag"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#153b60] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#214d73] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9d9f5]"
          >
            <ShoppingBag size={17} />
            <Plus className="absolute right-[9px] top-[8px] rounded-full bg-[#153b60]" size={9} strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function CategoriesPage({
  products,
  cartItems,
  cartCount,
  wishlistIds,
  wishlistProducts,
  cartOpen,
  wishlistOpen,
  onSetCartOpen,
  onSetWishlistOpen,
  onToggleWishlist,
  onAddToBag,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onViewProduct,
  selectedProduct,
  onCloseProduct,
}) {
  const prefersReducedMotion = useReducedMotion();
  const carouselRef = useRef(null);
  const productSectionRef = useRef(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState('birthday');
  const [sortBy, setSortBy] = useState('popularity');
  const [visibleCount, setVisibleCount] = useState(4);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const selectedCategory = giftCategories.find((category) => category.id === selectedCategoryId) ?? giftCategories[0];
  const categoryProducts = useMemo(() => {
    const allowedIds = categoryProductIds[selectedCategoryId] ?? [];
    const matches = products.filter((product) => allowedIds.includes(product.id));
    const sourceOrder = new Map(matches.map((product, index) => [product.id, index]));

    return matches.sort((first, second) => {
      if (sortBy === 'price-low') return first.price - second.price;
      if (sortBy === 'price-high') return second.price - first.price;

      if (sortBy === 'newest') {
        const firstIsNew = first.badge?.toLowerCase() === 'new' ? 1 : 0;
        const secondIsNew = second.badge?.toLowerCase() === 'new' ? 1 : 0;
        return secondIsNew - firstIsNew || sourceOrder.get(first.id) - sourceOrder.get(second.id);
      }

      const getPopularity = (product) => {
        const badge = product.badge?.toLowerCase();
        if (badge === 'bestseller') return 2;
        if (badge === 'popular') return 1;
        return 0;
      };
      return getPopularity(second) - getPopularity(first)
        || sourceOrder.get(first.id) - sourceOrder.get(second.id);
    });
  }, [products, selectedCategoryId, sortBy]);

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const matches = !query
      ? products.slice(0, 6)
      : products.filter((product) =>
        `${product.name} ${product.category} ${product.badge ?? ''}`.toLowerCase().includes(query),
      );
    return matches.map((product) => ({ ...product, image: getProductImage(product) }));
  }, [products, searchTerm]);

  const displayWishlistProducts = useMemo(
    () => wishlistProducts.map((product) => ({ ...product, image: getProductImage(product) })),
    [wishlistProducts],
  );

  const scrollCarousel = (direction) => {
    const track = carouselRef.current;
    const card = track?.querySelector('.gift-category-carousel-card');
    if (!track || !card) return;
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 24;
    track.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setVisibleCount(4);
    productSectionRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <div id="top" className="min-h-screen bg-[#F4F9FF] text-[#153B60]">
      <header className="fixed inset-x-0 top-0 z-40 bg-[#153B60] shadow-[0_10px_35px_rgba(10,35,55,0.18)]">
        <div className="border-b border-white/10 bg-[#102D44] px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white sm:text-[11px] sm:tracking-[0.28em]">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-2">
            <span className="text-[#EAF7FF]">Luxury gifting for every celebration</span>
            <a href="#gift-categories" className="shrink-0 rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-[9px] font-bold tracking-[0.16em] transition hover:bg-white hover:text-[#153b60] sm:tracking-[0.22em]">
              Explore
            </a>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          <Link to="/" aria-label="Home" className="shrink-0">
            <Logo />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`group relative text-sm font-medium tracking-[0.02em] transition hover:text-[#B9D9F5] ${link.label === 'Categories' ? 'text-[#B9D9F5]' : 'text-white'}`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-[#B9D9F5] transition-transform duration-300 ${link.label === 'Categories' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button type="button" onClick={() => setSearchOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#153b60] shadow-sm transition hover:bg-white" aria-label="Search gifts">
              <Search size={18} />
            </button>
            <button type="button" onClick={() => onSetWishlistOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#153b60] shadow-sm transition hover:bg-white" aria-label="Open wishlist">
              <Heart size={18} />
            </button>
            <button type="button" onClick={() => onSetCartOpen(true)} className="relative flex items-center gap-3 rounded-full bg-[#102D44] px-4 py-2.5 text-white shadow-[0_20px_40px_rgba(10,35,55,0.24)]" aria-label={`Cart, ${cartCount} items`}>
              <ShoppingBag size={18} />
              <span className="text-sm font-medium">Bag</span>
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#B9D9F5] px-1.5 text-xs font-semibold text-[#153b60]">{cartCount}</span>
            </button>
          </div>

          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-full border border-white/30 bg-white/10 p-3 text-white lg:hidden" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="border-t border-white/15 bg-[#153b60] px-4 py-5 lg:hidden"
            >
              <div className="space-y-4">
                {navigationLinks.map((link) => (
                  <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)} className="block text-base font-medium text-white">
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => { setSearchOpen(true); setMenuOpen(false); }} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white text-[#153b60]" aria-label="Search gifts">
                    <Search size={18} />
                  </button>
                  <button type="button" onClick={() => { onSetWishlistOpen(true); setMenuOpen(false); }} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white text-[#153b60]" aria-label="Open wishlist">
                    <Heart size={18} />
                  </button>
                  <button type="button" onClick={() => { onSetCartOpen(true); setMenuOpen(false); }} className="flex items-center gap-3 rounded-full bg-[#102D44] px-4 py-2.5 text-white" aria-label={`Cart, ${cartCount} items`}>
                    <ShoppingBag size={18} />
                    <span>Bag</span>
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#B9D9F5] px-1.5 text-xs font-semibold text-[#153b60]">{cartCount}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className="pt-[112px] sm:pt-[124px]">
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-5 sm:pb-12 sm:pt-8 lg:px-8">
          <h1 className="sr-only">Gifts for Every Special Moment</h1>
          <p className="sr-only">Make every celebration memorable with thoughtful and personalised gifts.</p>
          <div className="overflow-hidden rounded-[28px] border border-[#d9e8f6] bg-white shadow-[0_28px_90px_rgba(21,59,96,0.1)] sm:rounded-[36px]">
            <motion.img
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              src="/categories-banner.png"
              alt="Categories — Find the Perfect Gift for Every Occasion. A sky-blue gift box with a golden bow."
              className="block h-auto w-full"
            />
          </div>
        </section>

        <section id="gift-categories" className="overflow-hidden bg-white py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-7 flex items-end justify-between gap-5 sm:mb-9">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7b98b0] sm:text-xs">Thoughtfully curated</p>
                <h2 className="mt-2 font-display text-3xl leading-tight text-[#153B60] sm:text-4xl lg:text-5xl">Explore Gift Collections</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#69839a] sm:text-base">Find thoughtful gifts for celebrations, special people, and every memorable moment.</p>
              </div>
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Previous gift collections" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e8f6] bg-white text-[#153b60] transition hover:bg-[#edf6ff]">
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={() => scrollCarousel(1)} aria-label="Next gift collections" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d9e8f6] bg-white text-[#153b60] transition hover:bg-[#edf6ff]">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="relative">
              <div ref={carouselRef} className="gift-category-carousel-track flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-5 sm:gap-6">
                {giftCategories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    type="button"
                    data-category-id={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    aria-pressed={selectedCategoryId === category.id}
                    aria-label={`Show ${category.title}`}
                    className={`gift-category-carousel-card group relative isolate aspect-[13/9] shrink-0 snap-start overflow-hidden rounded-[26px] bg-[#eff6fc] text-left shadow-[0_20px_55px_rgba(21,59,96,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8B779] sm:rounded-[32px] ${selectedCategoryId === category.id ? 'ring-2 ring-[#D8B779] ring-offset-2' : ''}`}
                    whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                    whileTap={{ scale: 0.99 }}
                    style={{ flexBasis: 'clamp(280px, 30%, 370px)' }}
                  >
                    <motion.img
                      src={category.image}
                      alt=""
                      loading={index < 3 ? 'eager' : 'lazy'}
                      className="absolute inset-0 h-full w-full object-cover"
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-center gap-2 pt-1 sm:hidden">
                <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Previous gift collections" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9e8f6] bg-white text-[#153b60] shadow-sm">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={() => scrollCarousel(1)} aria-label="Next gift collections" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d9e8f6] bg-white text-[#153b60] shadow-sm">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section ref={productSectionRef} id="category-gifts" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
          <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7b98b0] sm:text-xs">Curated for your choice</p>
              <h2 className="mt-2 font-display text-3xl text-[#153B60] sm:text-4xl">{selectedCategory.title}</h2>
              <p className="mt-2 text-sm text-[#69839a]">{selectedCategory.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
              <p className="text-sm font-medium text-[#526f88]">
                <span className="font-semibold text-[#153b60]">{categoryProducts.length}</span> {categoryProducts.length === 1 ? 'thoughtful gift' : 'thoughtful gifts'}
              </p>
              <label className="flex items-center gap-2 rounded-full border border-[#d9e8f6] bg-white px-3 py-2 text-xs text-[#526f88] shadow-sm">
                <span className="whitespace-nowrap">Sort by</span>
                <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setVisibleCount(4); }} className="max-w-[155px] bg-transparent font-semibold text-[#153b60] outline-none">
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </label>
            </div>
          </div>

          {categoryProducts.length ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {categoryProducts.slice(0, visibleCount).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onAddToBag={onAddToBag}
                    onViewProduct={onViewProduct}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </div>
              {visibleCount < categoryProducts.length ? (
                <div className="mt-9 text-center">
                  <button type="button" onClick={() => setVisibleCount((count) => count + 4)} className="rounded-full border border-[#153b60]/20 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#153b60] shadow-sm transition hover:border-[#b9d9f5] hover:bg-[#edf6ff]">
                    Load more gifts
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-[30px] border border-dashed border-[#b9d9f5] bg-white px-6 py-14 text-center shadow-[0_18px_50px_rgba(21,59,96,0.05)]">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#edf6ff] text-[#153b60]">
                <Sparkles size={22} />
              </span>
              <h3 className="mt-5 font-display text-2xl text-[#153b60]">A special gift is on its way</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#69839a]">We are curating this gift collection. Please explore another category while we prepare something thoughtful.</p>
            </div>
          )}
        </section>
      </main>

      <footer id="contact" className="border-t border-[#153b60] bg-[#102D44] text-[#EAF7FC]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1.1fr] lg:px-8">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-7 text-[#cfe0eb]">
              Thoughtful gifting for life&apos;s most meaningful moments — made to feel personal, warm, and beautifully memorable.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B9D9F5]">Shop</p>
            <ul className="mt-5 space-y-3 text-sm text-[#EAF7FC]">
              <li><Link to="/categories#gift-categories">Gift Categories</Link></li>
              <li><Link to="/#featured-products">Shop All Gifts</Link></li>
              <li><Link to="/#featured-products">Personalised Gifts</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B9D9F5]">Support</p>
            <ul className="mt-5 space-y-3 text-sm text-[#EAF7FC]">
              <li><Link to="/#contact">Contact Us</Link></li>
              <li><Link to="/write-review">Write a Review</Link></li>
              <li><a href="#top">Back to top</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B9D9F5]">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-[#EAF7FC]">
              <li>hello@[yourgiftshopname].com</li>
              <li>+91 98765 43210</li>
              <li>12 Amber Lane, Bengaluru</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 py-5">
          <p className="text-center text-xs text-[#cfe0eb] sm:text-sm">© 2026 [YOUR GIFT SHOP NAME]. All rights reserved.</p>
        </div>
      </footer>

      <SearchOverlay
        isOpen={searchOpen}
        query={searchTerm}
        setQuery={setSearchTerm}
        results={searchResults}
        onClose={() => setSearchOpen(false)}
        onQuickView={(product) => onViewProduct({ ...product, image: getProductImage(product) })}
        onAddToBag={onAddToBag}
      />
      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => onSetCartOpen(false)}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onCheckout={onCheckout}
      />
      <WishlistDrawer
        isOpen={wishlistOpen}
        items={displayWishlistProducts}
        onClose={() => onSetWishlistOpen(false)}
        onRemove={onToggleWishlist}
        onAddToBag={onAddToBag}
      />
      <QuickViewModal product={selectedProduct} onClose={onCloseProduct} onAddToBag={onAddToBag} />
    </div>
  );
}

export default CategoriesPage;
