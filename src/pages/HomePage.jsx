import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Camera, ChevronLeft, ChevronRight, Gift, Heart, Menu, MessageCircleHeart, Search, ShieldCheck, ShoppingBag, Sparkles, Star, TrendingUp, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CartDrawer from '../components/CartDrawer';
import CheckoutPage from './CheckoutPage';
import Logo from '../components/Logo';
import PersonalizeModal from '../components/PersonalizeModal';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import SearchOverlay from '../components/SearchOverlay';
import WishlistDrawer from '../components/WishlistDrawer';
import { categoryCards, products, testimonials } from '../data/mockData';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Categories', href: '#categories' },
  { label: 'About Us', href: '#story' },
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

const collectionProducts = heroCategories.slice(0, 4).map((category, index) => ({
  ...products[index],
  id: `collection-${index}`,
  name: category.label,
  category: category.value,
  image: category.image,
}));

const customizedGiftCards = [
  { id: 'photo-album-keychains', title: 'Photo Album Keychains', image: '/Romantic%20Mini%20Photo%20Album%20Keychain.png' },
  { id: 'heart-lockets', title: 'Personalised Heart Lockets', image: '/Silver%20Heart%20Locket%20on%20Green%20Grass.png' },
  { id: 'moon-lamps', title: 'Personalised Moon Lamps', image: '/Romantic%20Crescent%20Moon%20LED%20Lamp.png' },
  { id: 'photo-mugs', title: 'Personalised Photo Mugs', image: '/Personalized%20Portrait%20Photo%20Mug.png' },
  { id: 'baby-keepsakes', title: 'Baby Keepsake Lamps', image: '/Personalized%20Crystal%20Baby%20Keepsake%20Lamp.png' },
  { id: 'wedding-plaques', title: 'Wedding Photo Plaques', image: '/Golden%20Happy%20Married%20Life%20Plaque.png' },
];

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
  const occasionRef = useRef(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(['photo-frame', 'teddy-bear']);
  const [selectedCategory, setSelectedCategory] = useState('All');
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
    if (selectedCategory === 'All') {
      return collectionProducts;
    }

    const matches = collectionProducts.filter(
      (product) =>
        product.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        product.name.toLowerCase().includes(selectedCategory.toLowerCase()),
    );

    return matches.length > 0 ? matches : collectionProducts;
  }, [selectedCategory, collectionProducts]);

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

  const scrollOccasions = (direction) => {
    if (!occasionRef.current) return;
    const scrollAmount = occasionRef.current.clientWidth * 0.75;
    occasionRef.current.scrollBy({ left: direction === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
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
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          <Link to="/" aria-label="Home">
            <Logo />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="group relative text-sm font-medium text-white transition hover:text-[#87CEEB]">
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

      <main id="home" className="pt-[76px]">
        <section id="categories" className="bg-white py-5">
          <div className="mx-auto max-w-[1700px] px-3 lg:px-8">
            <div className="flex snap-x snap-mandatory justify-start gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 lg:justify-center">
              {heroCategories.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedCategory(item.value)}
                  className={`group min-w-[104px] shrink-0 snap-start text-center transition sm:min-w-[118px] ${selectedCategory === item.value ? 'opacity-100' : 'opacity-95'}`}
                >
                  <div className={`mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full border-[3px] border-white bg-[#eef5f8] shadow-[0_10px_24px_rgba(24,59,86,0.14)] transition group-hover:scale-[1.02] sm:mb-3 sm:h-28 sm:w-28 sm:border-[4px] ${selectedCategory === item.value ? 'ring-4 ring-[#183B56]/10' : ''}`}>
                    <img src={item.image} alt={item.label} className="h-full w-full object-cover" />
                  </div>
                  <span className="block text-center text-xs font-medium leading-tight text-[#183B56] sm:text-[15px]">
                    {item.label}
                  </span>
                </button>
              ))}
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
                <h2 className="font-display text-[clamp(2rem,8vw,3rem)] leading-tight text-[#183B56]">Our Collections</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className="inline-flex items-center justify-center rounded-full border border-[#E5EDF2] bg-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#183B56] shadow-[0_10px_30px_rgba(24,59,86,0.04)] transition hover:bg-[#183B56] hover:text-white"
              >
                All
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  animationDelay={index * 0.12}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onToggleWishlist={toggleWishlist}
                  onAddToBag={handleAddToBag}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="signature-experience" className="mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-[28px] border border-[#e5f1f5] bg-[linear-gradient(115deg,#fffaf2_0%,#fffdf9_48%,#eaf7fc_100%)] px-4 py-8 shadow-[0_30px_80px_rgba(24,59,86,0.07)] sm:rounded-[36px] sm:px-6 sm:py-10 md:px-12 lg:py-14">
            <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#87CEEB]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-[#D6B77A]/10 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
              <motion.div
                variants={giftSceneVariants}
                initial={prefersReducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                onPointerMove={handleGiftPointerMove}
                onPointerLeave={handleGiftPointerLeave}
                className="relative mx-auto h-[290px] w-full max-w-[460px] sm:h-[390px] lg:h-[410px]"
                aria-label="A deep blue gift box filled with thoughtful gifts"
                role="img"
              >
                <motion.div
                  variants={giftDetailVariants}
                  custom={0.45}
                  style={{ translateX: glowParallaxX, translateY: glowParallaxY }}
                  className="absolute inset-x-4 bottom-0 h-48 rounded-full bg-[radial-gradient(ellipse,rgba(8,124,193,0.22),rgba(8,124,193,0)_69%)] blur-2xl"
                />
                <motion.div
                  variants={giftDetailVariants}
                  custom={0.55}
                  style={{ translateX: glowParallaxX, translateY: glowParallaxY }}
                  className="absolute inset-x-5 top-2 h-[82%] rounded-full bg-[radial-gradient(ellipse_at_50%_66%,rgba(135,206,235,0.22),rgba(255,255,255,0)_62%)]"
                />
                <motion.div
                  variants={giftDetailVariants}
                  custom={0.8}
                  style={{ translateX: glowParallaxX, translateY: glowParallaxY }}
                  className="absolute left-1/2 top-[30%] z-[2] h-36 w-52 -translate-x-1/2 rounded-full bg-[#48cafa]/20 blur-3xl sm:h-44 sm:w-64"
                />

                <motion.div
                  variants={giftBoxVariants}
                  style={{ translateX: boxParallaxX, translateY: boxParallaxY }}
                  className="absolute bottom-[38px] left-1/2 z-[4] h-[156px] w-[min(76%,340px)] -translate-x-1/2 overflow-hidden rounded-b-[24px] border-x border-b border-[#6cc8ef]/55 bg-[linear-gradient(100deg,#071f37_0%,#123e62_18%,#1c5b83_48%,#0c3557_78%,#061d34_100%)] shadow-[inset_0_12px_24px_rgba(1,14,27,0.65),0_34px_42px_rgba(13,49,77,0.34)] sm:h-[176px]"
                >
                  <div className="absolute inset-x-0 top-0 h-10 rounded-[50%] border border-[#9ce6ff]/50 bg-[radial-gradient(ellipse_at_50%_0%,#59bfe9_0%,#174f76_54%,#092844_100%)] shadow-[inset_0_8px_14px_rgba(2,20,36,0.62)]" />
                  <div className="absolute inset-y-0 left-[42%] z-[2] w-[18%] bg-[linear-gradient(90deg,#3c9cc8,#91ddf8_25%,#d0f4ff_47%,#65c4e9_70%,#2b83af)] shadow-[0_0_26px_rgba(135,206,235,0.3)]" />
                  <div className="absolute inset-y-0 left-[43%] z-[3] w-[16%] bg-[linear-gradient(90deg,rgba(255,255,255,0.1),rgba(255,255,255,0.44)_46%,rgba(255,255,255,0.06))]" />
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-[linear-gradient(180deg,rgba(3,23,41,0),rgba(2,17,32,0.55))]" />
                  <div className="absolute inset-x-0 bottom-0 h-1 border-t border-white/15" />
                  <div className="absolute inset-x-0 bottom-0 z-[8] h-[58px] bg-[linear-gradient(180deg,rgba(7,33,55,0),rgba(5,28,48,0.76))]" />
                </motion.div>
                <motion.div
                  variants={giftBoxVariants}
                  style={{ translateX: boxParallaxX, translateY: boxParallaxY }}
                  className="absolute bottom-[183px] left-1/2 z-[3] h-8 w-[min(80%,356px)] -translate-x-1/2 rounded-[50%] border border-[#8fd6f5]/65 bg-[linear-gradient(180deg,#78c9ed_0%,#23688f_48%,#092c4c_100%)] shadow-[0_9px_16px_rgba(8,40,67,0.27)]"
                />

                <motion.div
                  variants={giftLidVariants}
                  style={{ translateX: boxParallaxX, transformPerspective: 700 }}
                  className="absolute bottom-[210px] left-1/2 z-20 h-[56px] w-[min(82%,360px)] -translate-x-1/2 rounded-[9px] border border-[#78c8ec]/65 bg-[linear-gradient(160deg,#276d96_0%,#174e73_24%,#0b3455_60%,#061f38_100%)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.28),0_22px_28px_rgba(7,38,64,0.3)] sm:bottom-[224px] sm:h-[64px]"
                >
                  <div className="absolute inset-y-0 left-[42%] w-[18%] bg-[linear-gradient(90deg,#51a9d3,#a8eaff_24%,#ddf8ff_47%,#6dc6e9_76%,#3187b4)] shadow-[0_0_22px_rgba(135,206,235,0.34)]" />
                  <div className="absolute -top-9 left-[34%] h-12 w-[68px] -rotate-[18deg] rounded-[100%_18%_100%_18%] border-[7px] border-[#87CEEB] bg-[linear-gradient(130deg,rgba(207,245,255,0.78),rgba(56,157,201,0.86)_60%,rgba(16,87,127,0.9))] shadow-[inset_0_2px_5px_rgba(255,255,255,0.65),0_4px_10px_rgba(4,43,68,0.25)]" />
                  <div className="absolute -top-9 left-[50%] h-12 w-[68px] rotate-[24deg] rounded-[18%_100%_18%_100%] border-[7px] border-[#b4ecff] bg-[linear-gradient(130deg,rgba(220,250,255,0.78),rgba(78,178,218,0.88)_60%,rgba(18,99,139,0.92))] shadow-[inset_0_2px_5px_rgba(255,255,255,0.65),0_4px_10px_rgba(4,43,68,0.25)]" />
                  <div className="absolute -top-1 left-[48%] h-6 w-6 rounded-full border border-white/60 bg-[radial-gradient(circle_at_35%_30%,#e4faff,#62c5eb_65%,#1676a7)] shadow-[0_2px_8px_rgba(4,43,68,0.3)]" />
                </motion.div>

                <motion.div variants={giftItemsVariants} className="absolute inset-0">
                  {[
                    { image: '/Romantic%20Crescent%20Moon%20LED%20Lamp.png', alt: 'Personalised crescent moon lamp', className: 'left-[25%] top-[18%] w-[22%]', rotate: -5 },
                    { image: '/Romantic%20Mini%20Photo%20Album%20Keychain.png', alt: 'Personalised photo album keychain', className: 'left-[42%] top-[10%] w-[22%]', rotate: 2 },
                    { image: '/Silver%20Heart%20Locket%20on%20Green%20Grass.png', alt: 'Romantic heart locket', className: 'left-[59%] top-[18%] w-[22%]', rotate: 5 },
                    { image: '/Golden%20Happy%20Married%20Life%20Plaque.png', alt: 'Personalised wedding photo keepsake', className: 'left-[76%] top-[16%] w-[22%]', rotate: -3 },
                  ].map((item) => (
                    <motion.img
                      key={item.alt}
                      variants={giftItemVariants}
                      src={item.image}
                      alt={item.alt}
                      whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
                      className={`absolute z-30 aspect-square h-auto max-h-[104px] -translate-x-1/2 object-cover drop-shadow-[0_12px_15px_rgba(5,33,53,0.28)] sm:max-h-[120px] [mask-image:radial-gradient(ellipse_at_center,black_42%,rgba(0,0,0,0.78)_62%,transparent_78%)] ${item.className}`}
                      style={{ rotate: `${item.rotate}deg`, translateX: giftParallaxX, translateY: giftParallaxY }}
                    />
                  ))}

                  <motion.div
                    variants={giftItemVariants}
                    whileHover={prefersReducedMotion ? undefined : { y: -3, rotate: -5 }}
                    style={{ translateX: giftParallaxX, translateY: giftParallaxY }}
                    className="absolute bottom-[28px] left-[16%] z-[6] h-[68px] w-[60px] -rotate-[8deg] rounded-[5px] border border-[#a5e6ff]/70 bg-[linear-gradient(135deg,#478bb0_0%,#17628c_45%,#0a3455_100%)] shadow-[inset_0_2px_5px_rgba(255,255,255,0.25),0_18px_22px_rgba(8,39,64,0.28)] sm:h-[76px] sm:w-[66px]"
                  >
                    <div className="absolute inset-y-0 left-[41%] w-[18%] bg-[linear-gradient(90deg,#77c8e8,#d0f4ff_48%,#5bb0d4)]" />
                    <div className="absolute -top-2 left-[31%] h-4 w-7 rounded-full border-[3px] border-[#b8efff] bg-[#4aa5d0]" />
                  </motion.div>
                  <motion.div
                    variants={giftItemVariants}
                    whileHover={prefersReducedMotion ? undefined : { y: -3, rotate: 5 }}
                    style={{ translateX: giftParallaxX, translateY: giftParallaxY }}
                    className="absolute bottom-[35px] right-[15%] z-[6] h-[58px] w-[52px] rotate-[8deg] rounded-[5px] border border-[#a5e6ff]/70 bg-[linear-gradient(135deg,#5aa9cd_0%,#1e6f96_45%,#0a3455_100%)] shadow-[inset_0_2px_5px_rgba(255,255,255,0.25),0_18px_22px_rgba(8,39,64,0.28)] sm:h-[66px] sm:w-[58px]"
                  >
                    <div className="absolute inset-y-0 left-[41%] w-[18%] bg-[linear-gradient(90deg,#8bd8f1,#ddf8ff_48%,#5bb0d4)]" />
                    <div className="absolute -top-2 left-[31%] h-4 w-7 rounded-full border-[3px] border-[#b8efff] bg-[#4aa5d0]" />
                  </motion.div>
                </motion.div>

                {[
                  { left: '12%', top: '25%', delay: 1.2, size: 15 },
                  { left: '76%', top: '18%', delay: 1.45, size: 12 },
                  { left: '88%', top: '49%', delay: 1.7, size: 14 },
                  { left: '19%', top: '58%', delay: 1.95, size: 10 },
                ].map((sparkle) => (
                  <motion.span
                    key={`${sparkle.left}-${sparkle.top}`}
                    variants={giftDetailVariants}
                    custom={prefersReducedMotion ? 0 : sparkle.delay}
                    className="absolute z-30 hidden text-[#087CC1] drop-shadow-[0_0_10px_rgba(135,206,235,0.9)] sm:block"
                    style={{ left: sparkle.left, top: sparkle.top, fontSize: sparkle.size, translateX: sparkleParallaxX, translateY: sparkleParallaxY }}
                    aria-hidden="true"
                  >
                    <Sparkles size={sparkle.size} />
                  </motion.span>
                ))}
                <motion.span
                  variants={giftDetailVariants}
                  custom={prefersReducedMotion ? 0 : 1.5}
                  className="absolute left-[23%] top-[42%] z-30 hidden text-[#63c5ed] sm:block"
                  style={{ translateX: sparkleParallaxX, translateY: sparkleParallaxY }}
                  aria-hidden="true"
                >
                  <Heart size={17} fill="currentColor" />
                </motion.span>
                <motion.span
                  variants={giftDetailVariants}
                  custom={prefersReducedMotion ? 0 : 1.8}
                  className="absolute right-[19%] top-[57%] z-30 hidden text-[#87CEEB] sm:block"
                  style={{ translateX: sparkleParallaxX, translateY: sparkleParallaxY }}
                  aria-hidden="true"
                >
                  <Heart size={13} fill="currentColor" />
                </motion.span>
              </motion.div>

              <div className="relative z-10">
                <motion.p
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.55 }}
                  className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#087CC1]"
                >
                  Signature experience
                </motion.p>
                <motion.h2
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-3 max-w-[12ch] font-display leading-[1.06] text-[#183B56]"
                  style={{ fontSize: 'clamp(2.25rem, 4.15vw, 3.6rem)' }}
                >
                  <span className="lg:block">A Gift, Wrapped</span>
                  <span className="lg:block">With Love.</span>
                </motion.h2>
                <div className="my-6 flex items-center gap-3 text-[#D6B77A]" aria-hidden="true">
                  <span className="h-px w-20 bg-[#D6B77A]/60" />
                  <Heart size={15} fill="currentColor" />
                  <span className="h-px w-20 bg-[#D6B77A]/60" />
                </div>
                <motion.p
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.18 }}
                  className="max-w-xl text-base leading-8 text-[#4b6478] sm:text-lg"
                >
                  It&apos;s not just a gift. It&apos;s how you make them feel.
                </motion.p>
                <div className="mt-7 flex flex-wrap gap-2.5 text-sm text-[#183B56]">
                  {[
                    { label: 'Handpicked details', icon: Gift },
                    { label: 'Elegant wrapping', icon: Sparkles },
                    { label: 'Thoughtful surprises', icon: Heart },
                  ].map(({ label, icon: Icon }, index) => (
                    <motion.span
                      key={label}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.28 + index * 0.12 }}
                      className="inline-flex items-center gap-2 rounded-full border border-[#183B56]/35 bg-white/65 px-3.5 py-2.5"
                    >
                      <Icon size={15} className="text-[#087CC1]" />
                      {label}
                    </motion.span>
                  ))}
                </div>
                <motion.a
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : 0.68 }}
                  href="#featured-products"
                  className="mt-8 inline-flex items-center gap-2 font-display text-xl font-semibold text-[#183B56] transition hover:text-[#087CC1]"
                >
                  Discover the magic
                  <ArrowRight size={19} />
                </motion.a>
              </div>
            </div>
          </div>
        </section>

        <section id="occasions" className="mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:px-8 lg:py-24">
          <div className="mb-7 flex items-end justify-between gap-3 sm:mb-10 sm:gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5d7383]">Made personal</p>
              <h2 className="mt-2 font-display text-[clamp(2rem,8vw,3rem)] leading-tight text-[#183B56] sm:mt-3">Customized Gifts</h2>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <button type="button" onClick={() => scrollOccasions('prev')} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9E7EF] bg-white text-[#183B56] shadow-sm">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={() => scrollOccasions('next')} className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9E7EF] bg-white text-[#183B56] shadow-sm">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div ref={occasionRef} className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6">
            {customizedGiftCards.map((item) => (
              <div key={item.id} className="group relative w-[min(84vw,360px)] min-w-[min(84vw,290px)] snap-start overflow-hidden rounded-[24px] sm:rounded-[28px] md:w-[360px] md:min-w-[360px]">
                <img src={item.image} alt={item.title} className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[420px]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,27,0.16),rgba(10,18,27,0.78))]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#EAF7FC]">Inba&apos;s Mr &amp; Mrs Gifts</p>
                  <h3 className="mt-2 font-display text-3xl text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="story" className="mx-auto max-w-7xl px-4 py-14 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid overflow-hidden rounded-[34px] bg-[#F9FBFD] shadow-[0_30px_80px_rgba(24,59,86,0.08)] lg:grid-cols-2">
            <div className="h-[280px] overflow-hidden sm:h-[360px] lg:h-full lg:min-h-[420px]">
              <img
                src="/image.png"
                alt="Gift story"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5d7383]">Our story</p>
              <h2 className="mt-3 font-display text-[clamp(2rem,8vw,3rem)] leading-tight text-[#183B56]">More Than a Gift. A Feeling.</h2>
              <p className="mt-5 text-base leading-7 text-[#4b6478] sm:mt-6 sm:text-lg sm:leading-8">
                We believe the most meaningful gifts do more than surprise. They bring people closer, celebrate little victories, and turn ordinary moments into memories worth keeping.
              </p>
              <p className="mt-4 text-base leading-7 text-[#4b6478] sm:text-lg sm:leading-8">
                Thoughtful curation, premium presentation, and a little extra joy — that&apos;s the difference between a wrapped object and a cherished memory.
              </p>
              <button type="button" onClick={() => setCustomiseOpen(true)} className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-[#D9E7EF] bg-white px-6 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#183B56]">
                Discover the emotion
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#183B56] bg-[url('/background.png')] bg-cover bg-center py-14 text-white sm:py-20 lg:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[#102D44]/75" />
          <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-8 flex flex-col items-start justify-between gap-5 sm:mb-12 sm:flex-row sm:items-end sm:gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#cfe7f6]">Customer love</p>
                <h2 className="mt-3 max-w-[16ch] font-display text-[clamp(2rem,8vw,3rem)] leading-tight text-white">Loved by thoughtful people.</h2>
              </div>
              <div className="flex gap-3 self-end sm:self-auto">
                <button type="button" onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-[26px] bg-white/10 p-5 backdrop-blur-sm sm:rounded-[32px] sm:p-8 md:p-10">
              <div className="flex items-center gap-1 text-[#D6B77A]">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#edf8ff] sm:mt-6 sm:text-2xl sm:leading-10 md:text-3xl">
                “{testimonials[activeTestimonial].review}”
              </p>
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="font-display text-2xl text-white">{testimonials[activeTestimonial].name}</p>
                  <p className="mt-1 text-sm text-[#cfe7f6]">{testimonials[activeTestimonial].product}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#87CEEB]/15 text-[#87CEEB]">
                  <MessageCircleHeart size={24} />
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
              <li><a href="#story">About Us</a></li>
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
