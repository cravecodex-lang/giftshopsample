import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  BriefcaseBusiness,
  Camera,
  Check,
  Eye,
  Heart,
  Menu,
  MessageCircle,
  MessageCircleHeart,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BestSellersCarousel from '../components/BestSellersCarousel';
import CartDrawer from '../components/CartDrawer';
import CategoriesPage from './CategoriesPage';
import CheckoutPage from './CheckoutPage';
import Logo from '../components/Logo';
import PersonalizeModal from '../components/PersonalizeModal';
import ProductCatalogue from '../components/ProductCatalogue';
import QuickViewModal from '../components/QuickViewModal';
import SearchOverlay from '../components/SearchOverlay';
import WishlistDrawer from '../components/WishlistDrawer';
import { products, testimonials } from '../data/mockData';
import { categoryProductIds, giftCategories } from '../data/giftCategories';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Categories', href: '/categories' },
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
  { id: 'photo-album-keychains', title: 'Photo Album Keychains', subtitle: 'Keep favourite moments close.', image: '/Romantic%20Mini%20Photo%20Album%20Keychain.png', productIds: ['photo-frame', 'name-gift'] },
  { id: 'heart-lockets', title: 'Heart Lockets', subtitle: 'A keepsake made with love.', image: '/Silver%20Heart%20Locket%20on%20Green%20Grass.png', productIds: ['name-gift', 'photo-frame'] },
  { id: 'moon-lamps', title: 'Moon Lamps', subtitle: 'A little glow for their space.', image: '/Romantic%20Crescent%20Moon%20LED%20Lamp.png', productIds: ['candle-set'] },
  { id: 'photo-mugs', title: 'Photo Mugs', subtitle: 'Make every sip personal.', image: '/Personalized%20Portrait%20Photo%20Mug.png', productIds: ['photo-frame', 'name-gift'] },
  { id: 'baby-keepsakes', title: 'Baby Keepsakes', subtitle: 'Celebrate their tiniest moments.', image: '/Personalized%20Crystal%20Baby%20Keepsake%20Lamp.png', productIds: ['photo-frame', 'name-gift'] },
  { id: 'wedding-plaques', title: 'Wedding Plaques', subtitle: 'A lasting keepsake for forever.', image: '/Golden%20Happy%20Married%20Life%20Plaque.png', productIds: ['birthday-box', 'name-gift'] },
];

const budgetRanges = [
  { id: 'under-99', label: 'Under', amount: 99, min: 0, max: 99 },
  { id: '100-299', label: '₹100 – ₹299', amount: null, min: 100, max: 299 },
  { id: '300-599', label: '₹300 – ₹599', amount: null, min: 300, max: 599 },
];

const giftFinderSteps = [
  {
    key: 'recipient',
    shortLabel: 'Who it\'s for',
    title: 'Who are you shopping for?',
    options: [
      { value: 'Partner', label: 'Partner', icon: Heart },
      { value: 'Mother', label: 'Mother', icon: Baby },
      { value: 'Father', label: 'Father', icon: UserRound },
      { value: 'Friend', label: 'Friend', icon: Users },
      { value: 'Colleague', label: 'Colleague', icon: BriefcaseBusiness },
      { value: 'Someone Special', label: 'Someone Special', icon: Sparkles },
    ],
  },
  {
    key: 'occasion',
    shortLabel: 'Occasion',
    title: 'What is the occasion?',
    options: [
      { value: 'Birthday', label: 'Birthday' },
      { value: 'Anniversary', label: 'Anniversary' },
      { value: 'Wedding', label: 'Wedding' },
      { value: 'Farewell', label: 'Farewell' },
      { value: 'Valentine\'s Day', label: 'Valentine\'s Day' },
      { value: 'Just Because', label: 'Just Because' },
    ],
  },
  {
    key: 'budget',
    shortLabel: 'Budget',
    title: 'What is your budget?',
    options: [
      { value: 'Under ₹199', label: 'Under ₹199', min: 0, max: 199 },
      { value: '₹200–₹500', label: '₹200–₹500', min: 200, max: 500 },
      { value: '₹500–₹1,000', label: '₹500–₹1,000', min: 500, max: 1000 },
      { value: '₹1,000–₹2,000', label: '₹1,000–₹2,000', min: 1000, max: 2000 },
      { value: 'Above ₹2,000', label: 'Above ₹2,000', min: 2001, max: 99999 },
    ],
  },
  {
    key: 'preference',
    shortLabel: 'Preferences',
    title: 'What type of gift do you prefer?',
    options: [
      { value: 'Personalised', label: 'Personalised' },
      { value: 'Cute & Adorable', label: 'Cute & Adorable' },
      { value: 'Luxury & Premium', label: 'Luxury & Premium' },
      { value: 'Surprise Gift Box', label: 'Surprise Gift Box' },
      { value: 'Anything Special', label: 'Anything Special' },
    ],
  },
];

const recipientKeywords = {
  Partner: ['luxury', 'flowers', 'gift hamper', 'chocolate', 'personalised', 'love'],
  Mother: ['personalised', 'photo', 'frame', 'flower', 'candle', 'teddy', 'soft'],
  Father: ['luxury', 'hamper', 'gift hamper', 'premium', 'candle', 'personalised'],
  Friend: ['flowers', 'chocolate', 'gift hamper', 'teddy', 'candle', 'personalised'],
  Colleague: ['gift hamper', 'chocolate', 'premium', 'candle', 'luxury', 'box'],
  'Someone Special': ['personalised', 'luxury', 'gift hamper', 'flowers', 'name', 'surprise'],
};

const occasionKeywords = {
  Birthday: ['birthday', 'sweet', 'chocolate', 'gift hamper', 'bouquet', 'personalised'],
  Anniversary: ['anniversary', 'personalised', 'flower', 'hamper', 'luxury', 'photo'],
  Wedding: ['wedding', 'personalised', 'hampers', 'luxury', 'photo', 'gift'],
  Farewell: ['farewell', 'gift hamper', 'personalised', 'candle', 'chocolate', 'box'],
  "Valentine's Day": ['valentine', 'flower', 'love', 'gift hamper', 'chocolate', 'personalised'],
  'Just Because': ['just', 'gift hamper', 'personalised', 'teddy', 'luxury', 'sweet'],
};

const preferenceKeywords = {
  Personalised: ['personalised', 'photo', 'name', 'frame', 'custom'],
  'Cute & Adorable': ['teddy', 'soft', 'cute', 'bear', 'candle', 'gift'],
  'Luxury & Premium': ['luxury', 'premium', 'hamper', 'flower', 'gift hamper'],
  'Surprise Gift Box': ['gift hamper', 'box', 'surprise', 'luxury', 'sweet'],
  'Anything Special': ['gift', 'personalised', 'luxury', 'premium', 'surprise'],
};

const collectionProducts = heroCategories.slice(0, 4).map((category, index) => ({
  ...products[index],
  id: `collection-${index}`,
  name: category.title,
  category: category.title,
  image: category.image,
}));

const whatsappNumber = '919788591998';

function PremiumGiftFinder({ products, onAddToBag, onViewProduct }) {
  const prefersReducedMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    recipient: null,
    occasion: null,
    budget: null,
    preference: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentStepConfig = giftFinderSteps[currentStep];
  const currentSelection = answers[currentStepConfig.key];

  const recommendedProducts = useMemo(() => {
    if (!isSubmitted) return [];

    const { recipient, occasion, budget, preference } = answers;
    const criteria = [];
    if (recipient) criteria.push((product) => recipientKeywords[recipient]?.some((key) => `${product.name} ${product.category}`.toLowerCase().includes(key)));
    if (occasion) criteria.push((product) => occasionKeywords[occasion]?.some((key) => `${product.name} ${product.category}`.toLowerCase().includes(key)));
    if (preference) criteria.push((product) => preferenceKeywords[preference]?.some((key) => `${product.name} ${product.category}`.toLowerCase().includes(key)));
    const budgetOption = budget ? giftFinderSteps[2].options.find((option) => option.value === budget) : null;
    if (budgetOption) criteria.push((product) => product.price >= budgetOption.min && product.price <= budgetOption.max);
    if (!criteria.length) return products;

    const score = (product) => criteria.filter((matches) => matches(product)).length;
    const normalizedProducts = products.filter((product) => score(product) >= Math.min(2, criteria.length));

    if (normalizedProducts.length) return normalizedProducts;

    return products.filter((product) => score(product) >= 1);
  }, [answers, isSubmitted, products]);

  const handleSelection = (value) => {
    setAnswers((current) => ({
      ...current,
      [currentStepConfig.key]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < giftFinderSteps.length - 1) {
      setCurrentStep((step) => step + 1);
      return;
    }
    setIsSubmitted(true);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const resetFinder = () => {
    setCurrentStep(0);
    setAnswers({ recipient: null, occasion: null, budget: null, preference: null });
    setIsSubmitted(false);
  };

  const currentStepIndex = currentStep + 1;
  const stepOptions = currentStepConfig.options;
  const isFinalStep = currentStep === giftFinderSteps.length - 1;

  return (
    <section className="relative mx-auto mt-6 w-full max-w-[1400px] px-3 sm:px-4 lg:px-6">
      <style>{`
        .gift-finder-shell {
          background: linear-gradient(135deg, #edf7ff 0%, #dfeefc 25%, #e7f3ff 100%);
          border: 1px solid rgba(21, 59, 96, 0.08);
          box-shadow: 0 28px 80px rgba(21, 59, 96, 0.09);
        }
        .gift-finder-visual {
          position: relative;
          background: linear-gradient(180deg, #c2e2ff 0%, #b7dff8 100%);
          overflow: hidden;
          border-radius: 32px 0 0 32px;
        }
        .gift-finder-visual::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 60% 15%, rgba(255,255,255,0.6), rgba(255,255,255,0) 32%);
        }
        .gift-finder-ribbon {
          position: absolute;
          width: 220px;
          height: 26px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(122,193,255,0.9) 30%, rgba(76,144,214,0.9) 100%);
          box-shadow: 0 12px 30px rgba(36, 90, 156, 0.18);
          transform-origin: center;
        }
        .gift-finder-ribbon--one {
          left: 8%;
          top: 12%;
          transform: rotate(25deg) skewX(18deg);
        }
        .gift-finder-ribbon--two {
          right: 10%;
          top: 24%;
          transform: rotate(-22deg) skewX(-18deg);
        }
        .gift-finder-ribbon--three {
          left: 20%;
          bottom: 18%;
          transform: rotate(-27deg) skewX(-20deg);
        }
        .gift-finder-box {
          position: absolute;
          left: 50%;
          bottom: 88px;
          transform: translateX(-50%);
          width: min(69%, 460px);
          aspect-ratio: 1.35;
          border-radius: 18px 18px 12px 12px;
          background: linear-gradient(132deg, rgba(183,223,248,0.96) 0%, rgba(118,177,232,0.95) 42%, rgba(70,131,201,0.96) 100%);
          border: 2px solid rgba(255,255,255,0.76);
          box-shadow: 0 26px 40px rgba(30, 82, 143, 0.18), inset -10px -7px 26px rgba(28,91,164,0.28), inset 12px 8px 18px rgba(255,255,255,0.12);
        }
        .gift-finder-box::before,
        .gift-finder-box::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
        }
        .gift-finder-box::before {
          background: linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.12) 100%);
          clip-path: polygon(0 0, 100% 0, 100% 22%, 0 22%);
        }
        .gift-finder-box::after {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.32) 45%, rgba(255,255,255,0) 100%);
          clip-path: polygon(0 22%, 100% 22%, 100% 28%, 0 28%);
          opacity: 0.7;
        }
        .gift-finder-lid {
          position: absolute;
          left: 50%;
          bottom: 166px;
          transform: translateX(-50%) rotate(-6deg);
          width: min(72%, 500px);
          height: 84px;
          border-radius: 18px 18px 12px 12px;
          background: linear-gradient(120deg, rgba(184, 222, 249, 0.96) 0%, rgba(138,185,232,0.96) 28%, rgba(72,130,196,0.96) 100%);
          border: 2px solid rgba(255,255,255,0.7);
          box-shadow: inset -8px -8px 16px rgba(31, 93, 166, 0.2), 0 14px 24px rgba(30, 82, 143, 0.12);
        }
        .gift-finder-lid::before {
          content: '';
          position: absolute;
          left: 50%;
          top: -26px;
          width: 18px;
          height: 72px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: linear-gradient(180deg, #f4d583 0%, #d7b16c 40%, #af8d54 100%);
          box-shadow: 0 0 0 4px rgba(255,255,255,0.18);
        }
        .gift-finder-lid::after {
          content: '';
          position: absolute;
          left: 50%;
          top: -18px;
          width: 80%;
          height: 18px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,255,255,0.86), rgba(255,255,255,0.3), rgba(255,255,255,0.86));
          opacity: 0.75;
        }
        .gift-finder-ribbon-band {
          position: absolute;
          left: 50%;
          top: 0;
          width: 16px;
          height: 100%;
          transform: translateX(-50%);
          border-radius: 999px;
          background: linear-gradient(180deg, #f5d887 0%, #d1aa63 45%, #b68736 100%);
          box-shadow: 0 0 0 6px rgba(255,255,255,0.18);
        }
        .gift-finder-ribbon-band::before,
        .gift-finder-ribbon-band::after {
          content: '';
          position: absolute;
          top: 12px;
          width: 132px;
          height: 18px;
          background: linear-gradient(90deg, rgba(190,227,255,0.9), rgba(119,181,234,0.9));
          border-radius: 999px;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }
        .gift-finder-ribbon-band::before {
          left: -112px;
          transform: rotate(28deg);
        }
        .gift-finder-ribbon-band::after {
          right: -112px;
          transform: rotate(-28deg);
        }
        .gift-finder-standing {
          position: absolute;
          left: 50%;
          bottom: 50px;
          transform: translateX(-50%);
          width: min(72%, 420px);
          height: 94px;
          border-radius: 26px 26px 36px 36px;
          background: linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.04));
          border: 1px solid rgba(255,255,255,0.24);
          box-shadow: inset 0 14px 20px rgba(255,255,255,0.14), 0 10px 24px rgba(39,81,122,0.08);
        }
        .gift-finder-shimmer {
          position: absolute;
          left: 50%;
          bottom: 188px;
          transform: translateX(-50%);
          width: min(62%, 300px);
          height: 110px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0) 70%);
          filter: blur(8px);
          opacity: 0.8;
        }
        .gift-finder-badge {
          position: absolute;
          bottom: 10px;
          left: 25px;
          display: grid;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 14px;
          background: rgba(255,255,255,0.22);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.18);
          backdrop-filter: blur(10px);
        }
        .gift-finder-mini-box {
          position: absolute;
          width: clamp(52px, 8vw, 88px);
          aspect-ratio: 1;
          border-radius: 12px;
          background: linear-gradient(135deg, #e7f4ff 0%, #c0dffb 45%, #a9d2f4 100%);
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 16px 28px rgba(30, 82, 143, 0.16);
        }
        .gift-finder-mini-box::before {
          content: '';
          position: absolute;
          inset: 18% 18%;
          border-radius: 8px;
          background: linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.2), rgba(255,255,255,0.9));
          opacity: 0.7;
        }
        .gift-finder-mini-box::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          width: 12px;
          height: 100%;
          transform: translateX(-50%);
          border-radius: 999px;
          background: linear-gradient(180deg, #f2d27a 0%, #d4ad5c 100%);
        }
        .gift-finder-mini-box .gift-finder-mini-box__lid {
          position: absolute;
          left: 50%;
          top: -10px;
          transform: translateX(-50%);
          width: 110%;
          height: 12px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f2d27a 0%, #d2a95d 100%);
        }
        .gift-finder-mini-box .gift-finder-mini-box__lid::before,
        .gift-finder-mini-box .gift-finder-mini-box__lid::after {
          content: '';
          position: absolute;
          top: 8px;
          width: 54%;
          height: 10px;
          border-radius: 999px;
          background: rgba(110, 175, 244, 0.9);
        }
        .gift-finder-mini-box .gift-finder-mini-box__lid::before { left: -12%; transform: rotate(32deg); }
        .gift-finder-mini-box .gift-finder-mini-box__lid::after { right: -12%; transform: rotate(-32deg); }
        .gift-finder-card {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(21,59,96,0.08);
          backdrop-filter: blur(18px);
        }
        .gift-finder-option {
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease;
        }
        .gift-finder-option:hover {
          transform: translateY(-1px);
        }
        .gift-finder-option--selected {
          border-color: rgba(116, 170, 233, 0.95) !important;
          background: rgba(196, 225, 249, 0.38);
          box-shadow: 0 18px 32px rgba(68, 116, 173, 0.12);
        }
        @media (max-width: 1023px) {
          .gift-finder-visual {
            border-radius: 32px 32px 0 0;
          }
        }
      `}</style>

      <h2 className="mb-5 text-center font-display text-3xl font-semibold text-[#153b60] sm:text-4xl">
        Find a Perfect Gift
      </h2>
      <div className="gift-finder-shell relative overflow-hidden rounded-[34px] bg-[#edf8ff]">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="gift-finder-visual relative min-h-[220px] overflow-hidden p-0 sm:min-h-[320px] lg:min-h-[500px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.72),_rgba(255,255,255,0)_54%)]" aria-hidden="true" />
            <img
              src="/gift-finder-scene.png"
              alt="Premium gift box illustration"
              className="h-full w-full object-cover object-center"
            />
          </div>

          <div className="gift-finder-card relative flex min-h-[380px] items-center justify-center p-3 sm:min-h-[500px] sm:p-6 lg:p-8">
            <div className="w-full max-w-[610px] rounded-[28px] border border-[#dfeaf7] bg-white/70 p-4 shadow-[0_20px_60px_rgba(21,59,96,0.08)] backdrop-blur-md sm:p-6 lg:p-7">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div className="flex w-full items-center justify-between gap-2">
                  {[...Array(giftFinderSteps.length)].map((_, index) => {
                    const isActive = currentStep === index;
                    const isComplete = index < currentStep || (isSubmitted && index === giftFinderSteps.length - 1);
                    return (
                      <div key={`step-${index}`} className="flex flex-1 items-center justify-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${isActive || isComplete ? 'border-[#87bce7] bg-[#eaf6ff] text-[#153b60]' : 'border-[#d9e7f5] bg-[#f4f8fb] text-[#7d8fa5]'}`}>
                          {isComplete ? <Check size={16} /> : index + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6 grid grid-cols-4 gap-1 text-center text-[9px] font-medium leading-tight text-[#6a7c8b] sm:gap-2 sm:text-xs">
                {giftFinderSteps.map((step, index) => (
                  <div key={step.key} className={`rounded-full px-2 py-1.5 ${currentStep === index ? 'bg-[#edf7ff] text-[#153b60]' : 'bg-transparent'}`}>
                    {step.shortLabel}
                  </div>
                ))}
              </div>

              {!isSubmitted ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStepConfig.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.26, ease: 'easeOut' }}
                    className="space-y-5"
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8aa8c5]">
                      Step {currentStepIndex} of {giftFinderSteps.length}
                    </div>
                    <h3 className="max-w-[14ch] font-display text-3xl leading-[1.02] text-[#153b60] sm:text-[2.6rem]">
                      {currentStepConfig.title}
                    </h3>

                    <div className="mb-1 flex items-center gap-2 text-sm text-[#4f6478]">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#87bce7] bg-[#edf6ff] text-[#153b60]">
                        ✓
                      </span>
                      <span>This helps us find the perfect match</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {stepOptions.map((option) => {
                        const selected = currentSelection === option.value;
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSelection(option.value)}
                            className={`gift-finder-option relative flex min-h-[82px] flex-col items-center justify-center rounded-[22px] border p-4 text-center ${selected ? 'gift-finder-option--selected border-[#87bce7] bg-[#edf7ff]' : 'border-[#dfeaf7] bg-[#ffffff]'}`}
                          >
                            {selected ? (
                              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#153b60] text-white shadow-sm">
                                <Check size={14} />
                              </span>
                            ) : null}
                            {Icon ? (
                              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border ${selected ? 'border-[#87bce7] bg-[#dfeeff] text-[#153b60]' : 'border-[#dfeaf7] bg-[#f5faff] text-[#153b60]'}`}>
                                <Icon size={24} />
                              </div>
                            ) : null}
                            <span className={`font-medium ${selected ? 'text-[#153b60]' : 'text-[#183b56]'}`}>
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      {currentStep > 0 && (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="inline-flex items-center gap-2 rounded-full border border-[#dfeaf7] bg-[#f9fbff] px-4 py-3 text-sm font-semibold text-[#183b56] transition hover:bg-[#eef7ff]"
                        >
                          <ArrowLeft size={15} />
                          Back
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleNext}
                        className="ml-auto inline-flex w-full max-w-[210px] items-center justify-center gap-2 rounded-full bg-[#153b60] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(21,59,96,0.18)] transition hover:bg-[#0f2d49]"
                      >
                        {isFinalStep ? 'Find My Perfect Gift' : 'Continue'}
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8aa8c5]">Your picks</p>
                      <h3 className="mt-2 font-display text-3xl leading-tight text-[#153b60]">Gift Match</h3>
                    </div>
                    <button
                      type="button"
                      onClick={resetFinder}
                      className="rounded-full border border-[#dfeaf7] bg-[#f7fbff] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#153b60] transition hover:bg-[#edf6ff]"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="rounded-[22px] border border-[#dfeaf7] bg-[#f7fbff] p-3 text-sm text-[#49637d]">
                    {answers.recipient || 'Skipped'} · {answers.occasion || 'Skipped'} · {answers.budget || 'Skipped'} · {answers.preference || 'Skipped'}
                  </div>

                  {recommendedProducts.length ? (
                    <div className="grid max-h-[min(64vh,640px)] gap-2 overflow-y-auto overscroll-contain pr-2 sm:max-h-[min(76vh,800px)] sm:grid-cols-2 sm:gap-3">
                      {recommendedProducts.map((product) => (
                        <article key={product.id} className="overflow-hidden rounded-[22px] border border-[#dfeaf7] bg-white shadow-[0_12px_32px_rgba(21,59,96,0.05)]">
                          <img src={product.image} alt={product.name} className="h-24 w-full object-cover sm:h-32" />
                          <div className="space-y-2 p-3 sm:space-y-3 sm:p-3.5">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7b8ea2]">{product.category}</div>
                            <h4 className="line-clamp-2 text-base font-semibold text-[#153b60]">{product.name}</h4>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-base font-semibold text-[#153b60]">₹{product.price.toLocaleString('en-IN')}</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => onViewProduct(product)}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dfeaf7] bg-[#f7fbff] text-[#153b60] transition hover:bg-[#edf6ff]"
                                  aria-label={`View ${product.name}`}
                                  title="View product"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onAddToBag(product)}
                                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#153b60] text-white shadow-sm transition hover:scale-105 hover:bg-[#0f2d49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#87ceeb]"
                                  aria-label={`Add ${product.name} to bag`}
                                  title="Add to bag"
                                >
                                  <ShoppingBag size={17} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-[#cfe0f0] bg-[#f9fbff] p-6 text-center text-sm leading-6 text-[#49637d]">
                      No exact matches were found for this combination yet. Try a different budget or preferred style to uncover more gift ideas.
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShopByBudget({ selectedBudgetRange, onSelectBudget }) {
  return (
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
              onClick={() => onSelectBudget(range)}
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
  );
}

function FeaturedCategoriesCarousel({ categories, selectedCategory, onSelectCategory, prefersReducedMotion }) {
  const viewportRef = useRef(null);
  const firstGroupRef = useRef(null);
  const dragRef = useRef(null);
  const draggedClickRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return undefined;

    let frameId;
    let previousTime = 0;
    const scrollFrame = (time) => {
      const viewport = viewportRef.current;
      const cycleWidth = firstGroupRef.current?.scrollWidth ?? 0;
      if (viewport && cycleWidth) {
        const elapsed = previousTime ? Math.min(time - previousTime, 50) : 0;
        viewport.scrollLeft += elapsed * 0.028;
        if (viewport.scrollLeft >= cycleWidth) viewport.scrollLeft -= cycleWidth;
      }
      previousTime = time;
      frameId = window.requestAnimationFrame(scrollFrame);
    };

    frameId = window.requestAnimationFrame(scrollFrame);
    return () => window.cancelAnimationFrame(frameId);
  }, [isPaused, prefersReducedMotion]);

  const scrollByCategory = (direction) => {
    const viewport = viewportRef.current;
    const firstCard = firstGroupRef.current?.firstElementChild;
    const cycleWidth = firstGroupRef.current?.scrollWidth ?? 0;
    if (!viewport || !firstCard || !cycleWidth) return;

    if (direction < 0 && viewport.scrollLeft <= 1) viewport.scrollLeft = cycleWidth;
    if (direction > 0 && viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 1) {
      viewport.scrollLeft -= cycleWidth;
    }

    const gap = Number.parseFloat(window.getComputedStyle(firstGroupRef.current).columnGap) || 18;
    viewport.scrollBy({
      left: direction * (firstCard.getBoundingClientRect().width + gap),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const handlePointerDown = (event) => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: viewportRef.current.scrollLeft,
      moved: false,
      captured: false,
    };
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 5) drag.moved = true;
    if (drag.moved) {
      if (!drag.captured) {
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.captured = true;
      }
      viewportRef.current.scrollLeft = drag.startScrollLeft - distance;
      event.preventDefault();
    }
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (drag.moved) {
      draggedClickRef.current = true;
      window.setTimeout(() => { draggedClickRef.current = false; }, 0);
    }
    if (!event.currentTarget.matches(':hover') && !event.currentTarget.contains(document.activeElement)) {
      setIsPaused(false);
    }
  };

  return (
    <div
      className="mx-auto max-w-[1700px] px-3 lg:px-8"
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => {
        if (!dragRef.current && !viewportRef.current?.contains(document.activeElement)) setIsPaused(false);
      }}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(':hover')) {
          setIsPaused(false);
        }
      }}
      onClickCapture={(event) => {
        if (draggedClickRef.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      <div
        ref={viewportRef}
        className="category-marquee category-marquee--static cursor-grab select-none active:cursor-grabbing"
        aria-label="Featured gift categories. Drag or swipe to browse."
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            scrollByCategory(event.key === 'ArrowLeft' ? -1 : 1);
          }
        }}
      >
        <div className="category-marquee__track category-marquee__track--static">
          {[0, 1].map((groupIndex) => (
            <div
              key={groupIndex}
              ref={groupIndex === 0 ? firstGroupRef : undefined}
              className="category-marquee__group"
              aria-hidden={groupIndex === 1 ? 'true' : undefined}
            >
              {categories.map((category) => (
                groupIndex === 0 ? (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    aria-pressed={selectedCategory === category.id}
                    className={`group min-w-[118px] shrink-0 text-center transition sm:min-w-[200px] ${selectedCategory === category.id ? 'opacity-100' : 'opacity-95'}`}
                  >
                    <span className={`mx-auto mb-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[#eef5f8] shadow-[0_10px_24px_rgba(24,59,86,0.14)] transition group-hover:scale-[1.02] sm:mb-3 sm:h-36 sm:w-36 sm:border-[4px] ${selectedCategory === category.id ? 'ring-4 ring-[#183B56]/10' : ''}`}>
                      <img src={category.image} alt="" className="h-auto w-[84%] object-contain" />
                    </span>
                    <span className="block text-center text-[12px] font-medium leading-tight text-[#183B56] sm:text-[14px]">
                      {category.title}
                    </span>
                  </button>
                ) : (
                  <div key={category.id} className="min-w-[118px] shrink-0 text-center opacity-95 sm:min-w-[200px]">
                    <span className="mx-auto mb-2 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-[#eef5f8] shadow-[0_10px_24px_rgba(24,59,86,0.14)] sm:mb-3 sm:h-36 sm:w-36 sm:border-[4px]">
                      <img src={category.image} alt="" className="h-auto w-[84%] object-contain" />
                    </span>
                    <span className="block text-center text-[12px] font-medium leading-tight text-[#183B56] sm:text-[14px]">
                      {category.title}
                    </span>
                  </div>
                )
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomerReviews() {
  const [activeReview, setActiveReview] = useState(0);
  const review = testimonials[activeReview];

  return (
    <section
      id="customer-reviews"
      className="bg-[#183B56] py-16 text-white sm:py-20"
      aria-label="Customer reviews"
    >
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#cfe7f6]">Customer love</p>
            <h2 className="mt-2 max-w-[16ch] font-display text-[clamp(1.65rem,5vw,2.4rem)] leading-tight text-white">Loved by thoughtful people.</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/write-review"
              className="inline-flex min-h-9 items-center rounded-full border border-white/25 bg-white/10 px-3 text-[10px] font-semibold text-white transition hover:bg-white/20"
            >
              Write a Review
            </Link>
            <span aria-live="polite" className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[10px] font-semibold tracking-[0.12em] text-[#d9f1fc]">
              {String(activeReview + 1).padStart(2, '0')} <span className="text-white/45">/ {String(testimonials.length).padStart(2, '0')}</span>
            </span>
          </div>
        </div>

        <article className="rounded-[22px] border border-white/10 bg-white/10 p-5 sm:rounded-[26px] sm:p-7" aria-label={`Review ${activeReview + 1} of ${testimonials.length}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-[#D6B77A]" aria-label={`${review.rating} out of 5 stars`}>
              {[...Array(review.rating)].map((_, index) => (
                <Star key={index} size={15} fill="currentColor" />
              ))}
            </div>
            <MessageCircleHeart size={20} className="shrink-0 text-[#87CEEB]" />
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-[#edf8ff] sm:text-base sm:leading-7">
            “{review.review}”
          </p>
          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="font-display text-lg text-white sm:text-xl">{review.name}</p>
              <p className="mt-1 text-xs text-[#cfe7f6] sm:text-sm">{review.product}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveReview((index) => (index - 1 + testimonials.length) % testimonials.length)}
                className="inline-flex min-h-10 items-center rounded-full border border-white/25 px-4 text-xs font-semibold text-white transition hover:bg-white/15"
                aria-label="Show previous review"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setActiveReview((index) => (index + 1) % testimonials.length)}
                className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-xs font-semibold text-[#183B56] transition hover:bg-[#d9f1fc]"
                aria-label="Show next review"
              >
                Next
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

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

    const selectedProductIds = categoryProductIds[selectedCategory] ?? [];
    const matches = products.filter((product) => selectedProductIds.includes(product.id));

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

  if (location.pathname === '/categories') {
    return (
      <CategoriesPage
        products={products}
        homeCategories={heroCategories}
        cartItems={cartItems}
        cartCount={cartCount}
        wishlistIds={wishlistIds}
        wishlistProducts={wishlistProducts}
        cartOpen={cartOpen}
        wishlistOpen={wishlistOpen}
        onSetCartOpen={setCartOpen}
        onSetWishlistOpen={setWishlistOpen}
        onToggleWishlist={toggleWishlist}
        onAddToBag={handleAddToBag}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          navigate('/checkout');
        }}
        onViewProduct={setSelectedProduct}
        selectedProduct={selectedProduct}
        onCloseProduct={() => setSelectedProduct(null)}
      />
    );
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
            {navLinks.map((link) => {
              const isRoute = link.href.startsWith('/');
              const LinkComponent = isRoute ? Link : 'a';
              const linkProps = isRoute ? { to: link.href } : { href: link.href };
              return (
                <LinkComponent key={link.label} {...linkProps} className="group relative text-sm font-medium tracking-[0.02em] text-white transition hover:text-[#87CEEB]">
                  <span>{link.label}</span>
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#87CEEB] transition-transform duration-300 group-hover:scale-x-100" />
                </LinkComponent>
              );
            })}
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
                {navLinks.map((link) => {
                  const isRoute = link.href.startsWith('/');
                  const LinkComponent = isRoute ? Link : 'a';
                  const linkProps = isRoute ? { to: link.href } : { href: link.href };
                  return (
                    <LinkComponent key={link.label} {...linkProps} onClick={() => setMenuOpen(false)} className="block text-base font-medium text-white">
                      {link.label}
                    </LinkComponent>
                  );
                })}
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
            <FeaturedCategoriesCarousel
              categories={giftCategories}
              selectedCategory={selectedCategory}
              prefersReducedMotion={prefersReducedMotion}
              onSelectCategory={(categoryId) => {
                setSelectedCategory(categoryId);
                setSelectedBudgetRange(null);
                document.getElementById('featured-products')?.scrollIntoView({
                  behavior: prefersReducedMotion ? 'auto' : 'smooth',
                  block: 'start',
                });
              }}
            />
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


        <section id="occasions" className="overflow-hidden bg-[#F8FBFF] py-10 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <BestSellersCarousel
              products={products}
              wishlistIds={wishlistIds}
              onToggleWishlist={toggleWishlist}
              onAddToBag={handleAddToBag}
              onProductClick={setSelectedProduct}
            />
            <PremiumGiftFinder
              products={products}
              onAddToBag={handleAddToBag}
              onViewProduct={setSelectedProduct}
            />
            <ShopByBudget
              selectedBudgetRange={selectedBudgetRange}
              onSelectBudget={(range) => {
                setSelectedCategory('All');
                setSelectedBudgetRange(range);
                document.getElementById('featured-products')?.scrollIntoView({
                  behavior: prefersReducedMotion ? 'auto' : 'smooth',
                  block: 'start',
                });
              }}
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
          </div>
        </section>

        <CustomerReviews />

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
