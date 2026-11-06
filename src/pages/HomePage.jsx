import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Camera, ChevronLeft, ChevronRight, Heart, Menu, MessageCircle, MessageCircleHeart, Search, ShoppingBag, Star, TrendingUp, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BestSellersCarousel from '../components/BestSellersCarousel';
import CartDrawer from '../components/CartDrawer';
import CheckoutPage from './CheckoutPage';
import Logo from '../components/Logo';
import PersonalizeModal from '../components/PersonalizeModal';
import ProductCatalogue from '../components/ProductCatalogue';
import QuickViewModal from '../components/QuickViewModal';
import SearchOverlay from '../components/SearchOverlay';
import WishlistDrawer from '../components/WishlistDrawer';
import { categoryCards, products, testimonials } from '../data/mockData';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Categories', href: '#categories' },
  { label: 'Shop All', href: '#featured-products' },
  { label: 'Contact Us', href: '#contact' },
];

const giftSceneVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const giftBoxVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const giftLidVariants = {
  hidden: { y: 0, rotateX: 0 },
  visible: {
    y: -24,
    rotateX: -9,
    transition: { duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const giftItemVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.88 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 105, damping: 17 },
  },
};

const giftItemsVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 1.35, staggerChildren: 0.24 } },
};

const giftDetailVariants = {
  hidden: { opacity: 0, scale: 0.65, y: 8 },
  visible: (delay) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const heroCategories = [
  { value: 'Personalised', label: 'Photo Album Keychains', image: '/Romantic%20Mini%20Photo%20Album%20Keychain.png' },
  { value: 'Personalised', label: 'Heart Lockets', image: '/Silver%20Heart%20Locket%20on%20Green%20Grass.png' },
  { value: 'Home', label: 'Moon Lamps', image: '/Romantic%20Crescent%20Moon%20LED%20Lamp.png' },
  { value: 'Personalised', label: 'Photo Mugs', image: '/Personalized%20Portrait%20Photo%20Mug.png' },
  { value: 'Personalised', label: 'Baby Keepsakes', image: '/Personalized%20Crystal%20Baby%20Keepsake%20Lamp.png' },
  { value: 'Occasions', label: 'Wedding Plaques', image: '/Golden%20Happy%20Married%20Life%20Plaque.png' },
];

const budgetRanges = [
  { id: 'under-99', label: 'Under', amount: 99, min: 0, max: 99 },
  { id: '100-299', label: '₹100 – ₹299', amount: null, min: 100, max: 299 },
  { id: '300-599', label: '₹300 – ₹599', amount: null, min: 300, max: 599 },
];

const collectionProducts = heroCategories.slice(0, 4).map((category, index) => ({
  ...products[index],
  id: `collection-${index}`,
  name: category.label,
  category: category.value,
  image: category.image,
}));

const whatsappNumber = '919788591998';

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const giftPointerX = useMotionValue(0);
  const giftPointerY = useMotionValue(0);
  const smoothGiftPointerX = useSpring(giftPointerX, { stiffness: 120, damping: 22, mass: 0.45 });
  const smoothGiftPointerY = useSpring(giftPointerY, { stiffness: 120, damping: 22, mass: 0.45 });
  const glowParallaxX = useTransform(smoothGiftPointerX, [-1, 1], [-2, 2]);
  const glowParallaxY = useTransform(smoothGiftPointerY, [-1, 1], [-2, 2]);
  const boxParallaxX = useTransform(smoothGiftPointerX, [-1, 1], [-4, 4]);
  const boxParallaxY = useTransform(smoothGiftPointerY, [-1, 1], [-3, 3]);
  const giftParallaxX = useTransform(smoothGiftPointerX, [-1, 1], [-7, 7]);
  const giftParallaxY = useTransform(smoothGiftPointerY, [-1, 1], [-6, 6]);
  const sparkleParallaxX = useTransform(smoothGiftPointerX, [-1, 1], [-8, 8]);
  const sparkleParallaxY = useTransform(smoothGiftPointerY, [-1, 1], [-7, 7]);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(['photo-frame', 'teddy-bear']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [designName, setDesignName] = useState('Ari & Sam');
  const [designMessage, setDesignMessage] = useState('For all the little moments we treasure');
  const [customiseOpen, setCustomiseOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 });

  const handleGiftPointerMove = (event) => {
    if (event.pointerType === 'touch' || prefersReducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    giftPointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2);
    giftPointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
  };

  const handleGiftPointerLeave = () => {
    giftPointerX.set(0);
    giftPointerY.set(0);
  };

  const filteredProducts = useMemo(() => {
    if (selectedBudgetRange) {
      return products.filter(
        (product) => product.price >= selectedBudgetRange.min && product.price <= selectedBudgetRange.max,
      );
    }

    if (selectedCategory === 'All') return products;

    const matches = products.filter(
      (product) =>
        product.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        product.name.toLowerCase().includes(selectedCategory.toLowerCase()),
    );

    return matches.length > 0 ? matches : products;
  }, [selectedCategory, selectedBudgetRange]);

  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products.slice(0, 6);

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.badge?.toLowerCase().includes(term),
    );
  }, [searchTerm]);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const wishlistProducts = wishlistIds
    .map((id) => [...products, ...collectionProducts].find((product) => product.id === id))
    .filter(Boolean);

  const handleAddToBag = (product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
    setWishlistOpen(false);
    setSearchOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCartItems((current) =>
      current.flatMap((item) => {
        if (item.id !== productId) return [item];
        const nextQuantity = item.quantity + delta;
        return nextQuantity <= 0 ? [] : [{ ...item, quantity: nextQuantity }];
      }),
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems((current) => current.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (productId) => {
    setWishlistIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId],
    );
  };

  const onNewsletterSubmit = (event) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail);
    if (!valid) {
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }
    setNewsletterMessage('You are on the list for thoughtful updates.');
    setNewsletterEmail('');
  };

  const handleHeroMouseMove = (event) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
    setHeroOffset({ x, y });
  };

  if (location.pathname === '/checkout') {
    return <CheckoutPage items={cartItems} onOrderPlaced={() => setCartItems([])} />;
  }

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-[#243746]">
      <header className="fixed inset-x-0 top-0 z-40 bg-[#183B56] shadow-[0_10px_35px_rgba(10,35,55,0.18)]">
        <div className="border-b border-white/10 bg-[#102D44] px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-white sm:text-[11px]">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-2">
            <span className="text-[#EAF7FF]">Luxury gifting for every celebration</span>
            <button
              type="button"
              onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="rounded-full border border-white/40 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-[#183B56]"
            >
              Shop Now
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          <Link to="/" aria-label="Home" className="shrink-0">
            <Logo />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="group relative text-sm font-medium tracking-[0.02em] text-white transition hover:text-[#87CEEB]">
                <span>{link.label}</span>
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#87CEEB] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <button type="button" onClick={() => setSearchOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#183B56] shadow-sm transition hover:bg-white" aria-label="Search gifts">
              <Search size={18} />
            </button>
            <button type="button" onClick={() => setWishlistOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[#183B56] shadow-sm transition hover:bg-white" aria-label="Open wishlist">
              <Heart size={18} />
            </button>
            <button type="button" onClick={() => setCartOpen(true)} className="relative flex items-center gap-3 rounded-full bg-[#102D44] px-4 py-2.5 text-white shadow-[0_20px_40px_rgba(10,35,55,0.24)]" aria-label="Cart">
              <ShoppingBag size={18} />
              <span className="text-sm font-medium">Bag</span>
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#87CEEB] px-1.5 text-xs font-semibold text-[#183B56]">
                {cartCount}
              </span>
            </button>
          </div>

          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="rounded-full border border-white/30 bg-white/10 p-3 text-white lg:hidden" aria-label="Open navigation menu">
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="border-t border-white/15 bg-[#183B56] px-4 py-5 lg:hidden">
              <div className="space-y-4">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="block text-base font-medium text-white">
                    {link.label}
                  </a>
                ))}
                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => setSearchOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white text-[#183B56]">
                    <Search size={18} />
                  </button>
                  <button type="button" onClick={() => setWishlistOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white text-[#183B56]" aria-label="Open wishlist">
                    <Heart size={18} />
                  </button>
                  <button type="button" onClick={() => setCartOpen(true)} className="flex items-center gap-3 rounded-full bg-[#102D44] px-4 py-2.5 text-white">
                    <ShoppingBag size={18} />
                    <span>Bag</span>
                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#87CEEB] px-1.5 text-xs font-semibold text-[#183B56]">
                      {cartCount}
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main id="home" className="pt-[112px] sm:pt-[124px] lg:pt-[132px]">
        <section id="categories" className="bg-white py-5">
          <div className="mx-auto max-w-[1700px] px-3 lg:px-8">
            <div className="category-marquee" aria-label="Featured gift categories">
              <div className="category-marquee__track">
                <div className="category-marquee__group" aria-label="Gift categories list">
                  {heroCategories.map((item) => (
                    <button
                      key={`${item.label}-a`}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(item.value);
                        setSelectedBudgetRange(null);
                      }}
                      className={`group min-w-[118px] shrink-0 text-center transition sm:min-w-[132px] ${selectedCategory === item.value ? 'opacity-100' : 'opacity-95'}`}
                    >
                      <div className={`mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full border-[3px] border-white bg-[#eef5f8] shadow-[0_10px_24px_rgba(24,59,86,0.14)] transition group-hover:scale-[1.02] sm:mb-3 sm:h-28 sm:w-28 sm:border-[4px] ${selectedCategory === item.value ? 'ring-4 ring-[#183B56]/10' : ''}`}>
                        <img src={item.image} alt={item.label} className="h-full w-full object-cover" />
                      </div>
                      <span className="block text-center text-[12px] font-medium leading-tight text-[#183B56] sm:text-[14px]">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="category-marquee__group" aria-hidden="true">
                  {heroCategories.map((item) => (
                    <button
                      key={`${item.label}-b`}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(item.value);
                        setSelectedBudgetRange(null);
                      }}
                      className="group min-w-[118px] shrink-0 text-center transition opacity-95 sm:min-w-[132px]"
                    >
                      <div className="mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full border-[3px] border-white bg-[#eef5f8] shadow-[0_10px_24px_rgba(24,59,86,0.14)] transition group-hover:scale-[1.02] sm:mb-3 sm:h-28 sm:w-28 sm:border-[4px]">
                        <img src={item.image} alt={item.label} className="h-full w-full object-cover" />
                      </div>
                      <span className="block text-center text-[12px] font-medium leading-tight text-[#183B56] sm:text-[14px]">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative h-[48svh] min-h-[260px] max-h-[760px] overflow-hidden bg-[#102D44] sm:h-[58vh] sm:min-h-[360px] lg:h-[68vh] lg:min-h-[420px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/gemini_generated_video_47cac1c4.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </section>

        <section id="featured-products" className="bg-[#F8FBFF] py-14 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-[clamp(2rem,8vw,3rem)] leading-tight text-[#183B56]">
                  {selectedBudgetRange
                    ? selectedBudgetRange.amount
                      ? `Gifts under ₹${selectedBudgetRange.amount}`
                      : `Gifts ${selectedBudgetRange.label}`
                    : 'Our Collections'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedBudgetRange(null);
                }}
                className="inline-flex items-center justify-center rounded-full border border-[#E5EDF2] bg-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#183B56] shadow-[0_10px_30px_rgba(24,59,86,0.04)] transition hover:bg-[#183B56] hover:text-white"
              >
                All
              </button>
            </div>

            {filteredProducts.length ? (
              <ProductCatalogue
                products={filteredProducts}
                wishlistIds={wishlistIds}
                onToggleWishlist={toggleWishlist}
                onAddToBag={handleAddToBag}
              />
            ) : (
              <div className="mx-auto max-w-xl rounded-3xl border border-[#D9E7EF] bg-white/80 px-6 py-10 text-center shadow-[0_20px_60px_rgba(24,59,86,0.06)] sm:px-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A9874D]">A little more to explore</p>
                <h3 className="mt-3 font-display text-2xl text-[#183B56]">No gifts in this price range yet</h3>
                <p className="mt-3 text-sm leading-6 text-[#667B88]">
                  Browse all available gifts to find something special.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBudgetRange(null);
                    setSelectedCategory('All');
                  }}
                  className="mt-6 rounded-full bg-[#183B56] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#087CC1]"
                >
                  Browse all gifts
                </button>
              </div>
            )}
          </div>
        </section>


        <section id="occasions" className="overflow-hidden bg-[#F8FBFF] py-14 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <BestSellersCarousel
              products={products}
              wishlistIds={wishlistIds}
              onToggleWishlist={toggleWishlist}
              onAddToBag={handleAddToBag}
              onProductClick={setSelectedProduct}
            />
            <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-4 sm:mt-10 lg:grid-cols-2 lg:gap-6">
              {[
                {
                  title: 'Farewell Gifts',
                  description: 'Make their next chapter unforgettable.',
                  buttonLabel: 'Shop farewell gifts',
                  message: "Hi, I'm looking for a farewell gift.",
                  image: '/gift-box-3d.png',
                  detailImage: '/Golden%20Happy%20Married%20Life%20Plaque.png',
                  background: 'from-[#EAF7FC] via-[#F2F5FF] to-[#EFEAFF]',
                  imageAlt: 'Blue gift box and keepsake plaque',
                },
                {
                  title: 'Customise',
                  description: 'Make it personal with a gift made just for them.',
                  buttonLabel: 'Customise a gift',
                  message: "Hi, I'd like to customise a gift.",
                  image: '/Personalized%20Portrait%20Photo%20Mug.png',
                  detailImage: '/Romantic%20Mini%20Photo%20Album%20Keychain.png',
                  background: 'from-[#FFF5EA] via-[#F8F1F8] to-[#EFEAFF]',
                  imageAlt: 'Personalised photo mug and album keychain',
                },
              ].map((card) => (
                <article
                  key={card.title}
                  className={`group relative isolate flex min-h-[250px] overflow-hidden rounded-[24px] bg-gradient-to-br ${card.background} p-6 shadow-[0_18px_48px_rgba(24,59,86,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(24,59,86,0.14)] sm:min-h-[290px] sm:rounded-[30px] sm:p-8`}
                >
                  <div className="relative z-10 flex w-[58%] flex-col items-start justify-center sm:w-[55%]">
                    <h3 className="font-display text-[clamp(1.7rem,4vw,2.7rem)] font-medium uppercase leading-tight tracking-wide text-[#102D44]">
                      {card.title}
                    </h3>
                    <p className="mt-3 max-w-[19rem] text-sm leading-6 text-[#183B56] sm:mt-4 sm:text-base sm:leading-7">
                      {card.description}
                    </p>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(card.message)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#183B56] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#087CC1] sm:mt-7 sm:px-6 sm:text-sm"
                    >
                      <MessageCircle size={17} className="shrink-0 text-[#80E5A3]" />
                      {card.buttonLabel}
                    </a>
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex w-[47%] items-center justify-center sm:w-[45%]">
                    <img
                      src={card.image}
                      alt={card.imageAlt}
                      className="h-[88%] w-[90%] object-contain drop-shadow-[0_18px_18px_rgba(24,59,86,0.16)] transition duration-500 group-hover:scale-105"
                    />
                    <img
                      src={card.detailImage}
                      alt=""
                      aria-hidden="true"
                      className="absolute bottom-[8%] right-[4%] h-20 w-20 rounded-full border-[5px] border-white/90 object-cover shadow-[0_12px_28px_rgba(24,59,86,0.17)] transition duration-500 group-hover:-translate-y-2 sm:bottom-[9%] sm:right-[6%] sm:h-28 sm:w-28"
                    />
                  </div>
                </article>
              ))}
            </div>
            <div className="mx-auto mt-12 max-w-4xl sm:mt-16">
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#A9874D]">A lovely gift for every budget</p>
                <h3 className="mt-2 font-display text-2xl text-[#183B56] sm:text-3xl">Shop by Budget</h3>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-6">
                {budgetRanges.map((range) => {
                  const isSelected = selectedBudgetRange?.id === range.id;

                  return (
                    <button
                      key={range.id}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={range.amount ? `Show gifts under ₹${range.amount}` : `Show gifts from ₹${range.min} to ₹${range.max}`}
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedBudgetRange(range);
                        document.getElementById('featured-products')?.scrollIntoView({
                          behavior: prefersReducedMotion ? 'auto' : 'smooth',
                          block: 'start',
                        });
                      }}
                      className="group flex flex-col items-center text-center"
                    >
                      <span className={`flex aspect-square w-full max-w-[174px] flex-col items-center justify-center rounded-full border-[5px] border-white bg-gradient-to-br from-[#183B56] via-[#21658A] to-[#87CEEB] px-2 text-white shadow-[0_14px_34px_rgba(24,59,86,0.2)] ring-1 ring-[#87CEEB]/40 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_rgba(24,59,86,0.28)] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-[#D6B77A] sm:border-[7px] ${isSelected ? 'scale-105 ring-4 ring-[#D6B77A]' : ''}`}>
                        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#DDF5FF] sm:text-xs">
                          {range.amount ? 'Under' : 'Budget'}
                        </span>
                        <span className="mt-1 font-display text-[clamp(1.05rem,3.8vw,2rem)] leading-tight">
                          {range.amount ? `₹${range.amount}` : `₹${range.min}–${range.max}`}
                        </span>
                      </span>
                      <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#183B56] sm:mt-3 sm:text-xs">
                        {range.amount ? 'And under' : 'Gift range'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#183B56] bg-[url('/background.png')] bg-cover bg-center py-10 text-white sm:py-12">
          <div className="pointer-events-none absolute inset-0 bg-[#102D44]/75" />
          {!prefersReducedMotion && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
              <motion.span
                className="absolute left-[8%] top-[24%] text-2xl drop-shadow-[0_4px_12px_rgba(135,206,235,0.5)] sm:text-3xl"
                animate={{ x: [0, 100, 220, 320], y: [0, -22, 18, -8], rotate: [-12, 12, -8, 8] }}
                transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
              >
                🦋
              </motion.span>
              <motion.span
                className="absolute right-[10%] top-[58%] text-xl drop-shadow-[0_4px_12px_rgba(214,183,122,0.45)] sm:text-2xl"
                animate={{ x: [0, -90, -190, -270], y: [0, 20, -14, 8], rotate: [10, -12, 8, -6] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              >
                🦋
              </motion.span>
              <motion.span
                className="absolute left-[48%] top-[12%] text-lg opacity-75 sm:text-xl"
                animate={{ x: [0, 70, 130, 30], y: [0, 24, -12, 0], rotate: [-8, 8, -12, 4] }}
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                🦋
              </motion.span>
            </div>
          )}
          <div className="relative mx-auto max-w-5xl px-4 lg:px-8">
            <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end sm:gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#cfe7f6]">Customer love</p>
                <h2 className="mt-2 max-w-[16ch] font-display text-[clamp(1.65rem,5vw,2.4rem)] leading-tight text-white">Loved by thoughtful people.</h2>
              </div>
              <div className="flex gap-3 self-end sm:self-auto">
                <button type="button" onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/15">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/15">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm sm:rounded-[26px] sm:p-6 md:p-7">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 text-[#D6B77A]">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" />
                  ))}
                </div>
                <MessageCircleHeart size={20} className="shrink-0 text-[#87CEEB]" />
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#edf8ff] sm:mt-4 sm:text-base sm:leading-7">
                “{testimonials[activeTestimonial].review}”
              </p>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <div>
                  <p className="font-display text-lg text-white sm:text-xl">{testimonials[activeTestimonial].name}</p>
                  <p className="mt-1 text-xs text-[#cfe7f6] sm:text-sm">{testimonials[activeTestimonial].product}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:px-8 lg:py-24">
          <div className="rounded-[28px] bg-[linear-gradient(135deg,#dff3fb,#edf8ff_51%,#fff9f1)] p-5 shadow-[0_30px_90px_rgba(24,59,86,0.08)] sm:rounded-[38px] sm:p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="relative flex justify-center">
                <div className="absolute left-8 top-4 h-28 w-28 rounded-full bg-[#87CEEB]/30 blur-3xl" />
                <div className="relative h-[200px] w-[200px] rounded-[28px] bg-[linear-gradient(135deg,#fef9f2,#eaf7fc)] p-4 shadow-[0_30px_80px_rgba(24,59,86,0.12)] sm:h-[240px] sm:w-[240px] sm:rounded-[32px]">
                  <div className="flex h-full items-center justify-center rounded-[24px] border border-[#D9E7EF] bg-white/70 text-[#183B56]">
                    <img
                      src="/Inba’s Mr & Mrs Gifts Logo.png"
                      alt="Mr & Mrs Gifts"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5d7383]">Stay in the loop</p>
                <h2 className="mt-3 font-display text-[clamp(2rem,8vw,3rem)] leading-tight text-[#183B56]">A Little Joy in Your Inbox.</h2>
                <p className="mt-4 text-base leading-7 text-[#4b6478] sm:text-lg sm:leading-8">Discover thoughtful gifting ideas, new arrivals, and special surprises.</p>
                <form onSubmit={onNewsletterSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(event) => setNewsletterEmail(event.target.value)}
                    placeholder="Your email address"
                    className="flex-1 rounded-full border border-[#D9E7EF] bg-white/80 px-5 py-3.5 text-[#183B56] outline-none placeholder:text-[#7d8f9d] focus:border-[#87CEEB]"
                  />
                  <button type="submit" className="rounded-full bg-[#183B56] px-5 py-3.5 text-sm font-medium uppercase tracking-[0.12em] text-white">
                    Subscribe
                  </button>
                </form>
                {newsletterMessage ? <p className="mt-4 text-sm text-[#183B56]">{newsletterMessage}</p> : null}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-[#183B56] bg-[#102D44] text-[#EAF7FC]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.8fr_0.8fr_1.1fr] lg:px-8">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-7 text-[#cfe0eb]">
              Thoughtful gifting for life&apos;s most meaningful moments — made to feel personal, warm, and beautifully memorable.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#87CEEB]">Shop</p>
            <ul className="mt-5 space-y-3 text-sm text-[#EAF7FC]">
              <li><a href="#featured-products">Gift Hampers</a></li>
              <li><a href="#featured-products">Personalised Gifts</a></li>
              <li><a href="#categories">Occasion Gifts</a></li>
              <li><a href="#featured-products">Corporate Gifts</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#87CEEB]">Support</p>
            <ul className="mt-5 space-y-3 text-sm text-[#EAF7FC]">
              <li><a href="#">Newsletter</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#87CEEB]">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-[#EAF7FC]">
              <li>hello@[yourgiftshopname].com</li>
              <li>+91 98765 43210</li>
              <li>12 Amber Lane, Bengaluru</li>
            </ul>
            <div className="mt-6 flex items-center gap-3 text-[#EAF7FC]">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10"><Camera size={16} /></a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10"><TrendingUp size={16} /></a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10"><ShoppingBag size={16} /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/15 py-5">
          <p className="text-center text-sm text-[#cfe0eb]">© 2026 [YOUR GIFT SHOP NAME]. All rights reserved.</p>
        </div>
      </footer>

      <SearchOverlay
        isOpen={searchOpen}
        query={searchTerm}
        setQuery={setSearchTerm}
        results={searchResults}
        onClose={() => setSearchOpen(false)}
        onQuickView={setSelectedProduct}
        onAddToBag={handleAddToBag}
      />
      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          navigate('/checkout');
        }}
      />
      <WishlistDrawer
        isOpen={wishlistOpen}
        items={wishlistProducts}
        onClose={() => setWishlistOpen(false)}
        onRemove={toggleWishlist}
        onAddToBag={handleAddToBag}
      />
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToBag={handleAddToBag} />
      <PersonalizeModal
        isOpen={customiseOpen}
        nameInput={designName}
        setNameInput={setDesignName}
        messageInput={designMessage}
        setMessageInput={setDesignMessage}
        onClose={() => setCustomiseOpen(false)}
        onSave={() => setCustomiseOpen(false)}
      />
    </div>
  );
}

export default HomePage;
