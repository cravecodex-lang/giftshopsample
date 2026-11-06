import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { getProductImage } from '../data/productImages';
import './BestSellersCarousel.css';

const mod = (value, length) => ((value % length) + length) % length;

function BestSellersCarousel({ products, wishlistIds, onToggleWishlist, onAddToBag, onProductClick }) {
  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const phaseRef = useRef(0);
  const tweenRef = useRef(null);
  const touchStartRef = useRef(null);
  const swipeHandledRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const navigateBy = useCallback((amount) => {
    if (prefersReducedMotion) {
      phaseRef.current = mod(phaseRef.current + amount, products.length);
      tweenRef.current = null;
      return;
    }

    tweenRef.current = {
      from: phaseRef.current,
      to: phaseRef.current + amount,
      startedAt: performance.now(),
    };
  }, [prefersReducedMotion, products.length]);

  const navigateTo = useCallback((index) => {
    const current = phaseRef.current;
    let delta = mod(index - current, products.length);
    if (delta > products.length / 2) delta -= products.length;
    navigateBy(delta);
  }, [navigateBy, products.length]);

  useEffect(() => {
    if (!products.length) return undefined;

    let frameId;
    let previousTime = 0;
    let lastActiveUpdate = 0;
    const tweenDuration = 650;

    const renderFrame = (time) => {
      const elapsed = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;

      if (tweenRef.current) {
        const tween = tweenRef.current;
        const progress = Math.min((time - tween.startedAt) / tweenDuration, 1);
        const eased = 1 - ((1 - progress) ** 3);
        phaseRef.current = tween.from + ((tween.to - tween.from) * eased);
        if (progress === 1) {
          phaseRef.current = mod(tween.to, products.length);
          tweenRef.current = null;
        }
      } else if (document.visibilityState === 'visible') {
        const autoSpeed = prefersReducedMotion ? 0.045 : 0.075;
        phaseRef.current = mod(phaseRef.current + (elapsed * autoSpeed), products.length);
      }

      const stageWidth = stageRef.current?.clientWidth ?? window.innerWidth;
      const cardWidth = cardsRef.current.find(Boolean)?.offsetWidth ?? 240;
      const spacing = cardWidth + 12;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        let offset = mod(index - phaseRef.current + (products.length / 2), products.length) - (products.length / 2);
        const distance = Math.abs(offset);
        const angle = offset * 16;
        const depth = -(offset ** 2) * 18;
        const scale = Math.max(0.78, 1.1 - (Math.min(distance, 3) * 0.09));
        const opacity = Math.max(0.32, 1 - (distance * 0.12));
        const x = offset * spacing;
        const z = depth - (Math.abs(x) > stageWidth * 0.6 ? 80 : 0);

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(${angle}deg) scale(${scale})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = String(100 - Math.round(Math.abs(offset) * 10));
        card.style.pointerEvents = opacity < 0.08 ? 'none' : 'auto';
        card.inert = opacity < 0.08;
      });

      if (time - lastActiveUpdate > 120) {
        const nextActiveIndex = mod(Math.round(phaseRef.current), products.length);
        setActiveIndex((current) => current === nextActiveIndex ? current : nextActiveIndex);
        lastActiveUpdate = time;
      }

      frameId = window.requestAnimationFrame(renderFrame);
    };

    frameId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(frameId);
  }, [prefersReducedMotion, products]);

  const handlePointerUp = (event) => {
    if (touchStartRef.current === null) return;
    const distance = event.clientX - touchStartRef.current;
    touchStartRef.current = null;
    if (Math.abs(distance) < 40) return;
    swipeHandledRef.current = true;
    navigateBy(distance < 0 ? 1 : -1);
  };

  const handleProductClick = (event, product) => {
    if (swipeHandledRef.current) {
      swipeHandledRef.current = false;
      event.preventDefault();
      return;
    }
    onProductClick(product);
  };

  if (!products.length) return null;

  return (
    <div className="best-sellers">
      <div className="best-sellers__heading">
        <p>THOUGHTFULLY CHOSEN · BEAUTIFULLY REMEMBERED</p>
        <h2>BEST SELLERS</h2>
        <span>Little things. Beautiful memories.</span>
      </div>

      <div
        ref={stageRef}
        className="best-sellers__stage"
        onPointerDown={(event) => {
          swipeHandledRef.current = false;
          touchStartRef.current = event.clientX;
        }}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => { touchStartRef.current = null; }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') navigateBy(-1);
          if (event.key === 'ArrowRight') navigateBy(1);
        }}
        tabIndex={0}
        aria-label="Best-selling gifts in a 3D carousel. Swipe or use the arrow keys to browse."
      >
        <div className="best-sellers__arc-light" aria-hidden="true" />
        {products.map((product, index) => (
          <article
            key={product.id}
            ref={(element) => { cardsRef.current[index] = element; }}
            className="best-sellers__card"
            style={{ '--card-index': index }}
          >
            <button
              type="button"
              className="best-sellers__view"
              onClick={(event) => handleProductClick(event, { ...product, image: getProductImage(product) })}
              aria-label={`View ${product.name}`}
            >
              <img src={getProductImage(product)} alt={product.name} draggable="false" />
              <span className="best-sellers__image-shade" />
              <span className="best-sellers__product-info">
                <span className="best-sellers__category">{product.category}</span>
                <span className="best-sellers__name">{product.name}</span>
                <span className="best-sellers__price">₹{product.price.toLocaleString('en-IN')}</span>
              </span>
            </button>
            <button
              type="button"
              className={`best-sellers__wishlist${wishlistIds.includes(product.id) ? ' is-saved' : ''}`}
              onClick={() => onToggleWishlist(product.id)}
              aria-label={wishlistIds.includes(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={wishlistIds.includes(product.id)}
            >
              <Heart size={16} fill={wishlistIds.includes(product.id) ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              className="best-sellers__add"
              onClick={() => onAddToBag(product)}
              aria-label={`Add ${product.name} to bag`}
            >
              <ShoppingBag size={14} />
              <span>Add to Bag</span>
            </button>
          </article>
        ))}
      </div>

      <div className="best-sellers__controls">
        <button type="button" className="best-sellers__arrow" onClick={() => navigateBy(-1)} aria-label="Previous best seller">
          <ChevronLeft size={19} />
        </button>
        <div className="best-sellers__progress" aria-label={`Product ${activeIndex + 1} of ${products.length}`}>
          {products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={`best-sellers__progress-dot${index === activeIndex ? ' is-active' : ''}`}
              onClick={() => navigateTo(index)}
              aria-label={`Show ${product.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
        <span className="best-sellers__counter">{String(activeIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}</span>
        <button type="button" className="best-sellers__arrow" onClick={() => navigateBy(1)} aria-label="Next best seller">
          <ChevronRight size={19} />
        </button>
      </div>
    </div>
  );
}

export default BestSellersCarousel;
