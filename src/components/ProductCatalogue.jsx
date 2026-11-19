import { useEffect, useRef, useState } from 'react';
import { BookOpen, Gift, Heart, ShoppingBag, Sparkles, Star } from 'lucide-react';
import './ProductCatalogue.css';

const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

function ProductPage({ product, pageNumber, isWishlisted, onToggleWishlist, onAddToBag }) {
  if (!product) {
    return (
      <div className="catalogue-page catalogue-page--blank" aria-hidden="true" />
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  return (
    <article className="catalogue-page" data-page-index={pageNumber - 1} aria-label={`${product.name}, page ${pageNumber}`}>
      <div className="catalogue-page__topline">
        <span>{product.category}</span>
        <span>INBA&apos;S · MR &amp; MRS GIFTS</span>
      </div>

      <div className="catalogue-page__photograph">
        {product.badge && <span className="catalogue-page__badge">{product.badge}</span>}
        <img src={product.image} alt={product.imageAlt ?? product.name} draggable="false" />
      </div>

      <div className="catalogue-page__details">
        <div className="catalogue-page__rating" aria-label="Product rating">
          {[0, 1, 2, 3, 4].map((star) => (
            <Star key={star} size={13} fill="currentColor" className={star === 4 ? 'catalogue-page__star--partial' : ''} />
          ))}
        </div>
        <h3>{product.name}</h3>
        <div className="catalogue-page__pricing">
          <strong>{formatPrice(product.price)}</strong>
          {product.originalPrice && (
            <>
              <del>{formatPrice(product.originalPrice)}</del>
              <span>{discount}% OFF</span>
            </>
          )}
        </div>
        <div className="catalogue-page__actions">
          <button
            type="button"
            className={`catalogue-page__wishlist${isWishlisted ? ' is-saved' : ''}`}
            onClick={() => onToggleWishlist(product.id)}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={isWishlisted}
          >
            <Heart size={17} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button type="button" className="catalogue-page__add" onClick={() => onAddToBag(product)}>
            <ShoppingBag size={15} />
            Add to Bag
          </button>
        </div>
      </div>

      <span className="catalogue-page__number">{pageNumber}</span>
    </article>
  );
}

function ProductCatalogue({ products, wishlistIds, onToggleWishlist, onAddToBag }) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches);
  const [pageIndex, setPageIndex] = useState(0);
  const [flip, setFlip] = useState(null);
  const [bookState, setBookState] = useState('closed');
  const pointerStart = useRef(null);
  const suppressClick = useRef(false);
  const visiblePageCount = isMobile ? 1 : 2;
  const pageStep = visiblePageCount;
  const lastPageIndex = isMobile
    ? Math.max(0, products.length - 1)
    : Math.max(0, Math.floor((products.length - 1) / pageStep) * pageStep);
  const safePageIndex = Math.min(pageIndex, lastPageIndex);
  const visiblePageIndex = safePageIndex;
  const displayedProducts = Array.from(
    { length: visiblePageCount },
    (_, index) => products[visiblePageIndex + index],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)');
    const handleViewportChange = (event) => {
      setIsMobile(event.matches);
      setFlip(null);
      setPageIndex((index) => {
        if (event.matches) return Math.min(index, Math.max(0, products.length - 1));
        const stepLastIndex = Math.max(0, Math.floor((products.length - 1) / 2) * 2);
        return Math.min(index, stepLastIndex);
      });
    };

    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, [products.length]);

  useEffect(() => {
    setFlip(null);
    setPageIndex(0);
  }, [products]);

  useEffect(() => {
    if (bookState !== 'opening' && bookState !== 'closing') return undefined;

    const timeoutId = window.setTimeout(() => {
      if (bookState === 'opening') {
        setBookState('open');
      } else {
        setPageIndex(0);
        setFlip(null);
        setBookState('closed');
      }
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [bookState]);

  useEffect(() => {
    if (!flip) return undefined;

    const timeoutId = window.setTimeout(() => {
      setPageIndex(Math.min(flip.targetIndex, lastPageIndex));
      setFlip(null);
    }, 950);

    return () => window.clearTimeout(timeoutId);
  }, [flip, lastPageIndex]);

  const turnPage = (direction) => {
    if (flip) return;
    const currentIndex = Math.min(pageIndex, lastPageIndex);
    const isNext = direction === 'next';
    const targetIndex = isNext
      ? Math.min(currentIndex + pageStep, lastPageIndex)
      : Math.max(currentIndex - pageStep, 0);
    if (targetIndex === currentIndex) {
      if (isNext && bookState === 'open' && currentIndex >= lastPageIndex) setBookState('closing');
      return;
    }

    const frontIndex = isMobile
      ? currentIndex
      : isNext
        ? currentIndex + 1
        : currentIndex;
    const backIndex = isMobile
      ? targetIndex
      : isNext
        ? targetIndex
        : targetIndex + 1;
    setFlip({ direction, targetIndex, frontIndex, backIndex });
  };

  const handleAnimationEnd = (event) => {
    if (event.target !== event.currentTarget || !flip) return;
    setPageIndex(Math.min(flip.targetIndex, lastPageIndex));
    setFlip(null);
  };

  const handleCoverAnimationEnd = (event) => {
    if (event.target !== event.currentTarget) return;
    if (bookState === 'opening') {
      setBookState('open');
    } else if (bookState === 'closing') {
      setPageIndex(0);
      setFlip(null);
      setBookState('closed');
    }
  };

  const openBook = () => {
    if (bookState === 'closed') setBookState('opening');
  };

  const handleKeyDown = (event) => {
    if (bookState !== 'open') return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      turnPage('next');
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      turnPage('previous');
    }
  };

  const handlePointerDown = (event) => {
    if (
      bookState !== 'open'
      || !event.isPrimary
      || (event.pointerType === 'mouse' && event.button !== 0)
      || event.target.closest('button, a, input, textarea, select')
      || !event.target.closest('.catalogue-page:not(.catalogue-page--blank)')
    ) {
      return;
    }

    pointerStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event) => {
    const start = pointerStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    pointerStart.current = null;

    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    if (Math.abs(distanceX) < 48 || Math.abs(distanceX) < Math.abs(distanceY)) return;

    suppressClick.current = true;
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 500);
    turnPage(distanceX < 0 ? 'next' : 'previous');
  };

  const handlePointerCancel = () => {
    pointerStart.current = null;
  };

  const handleBookClick = (event) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      event.preventDefault();
      return;
    }
    if (bookState !== 'open' || flip) return;
    if (event.target.closest('button, a, input, textarea, select')) return;

    const { left, width } = event.currentTarget.getBoundingClientRect();
    turnPage(event.clientX >= left + width / 2 ? 'next' : 'previous');
  };

  const pageLabel = isMobile
    ? `Page ${visiblePageIndex + 1} of ${products.length}`
    : `Pages ${visiblePageIndex + 1}–${Math.min(visiblePageIndex + visiblePageCount, products.length)} of ${products.length}`;
  const isAtStart = safePageIndex <= 0;
  const isAtEnd = safePageIndex >= lastPageIndex;
  const isBookBusy = bookState === 'opening' || bookState === 'closing';

  const handleNext = () => {
    if (bookState === 'closed') {
      openBook();
    } else if (bookState === 'open' && isAtEnd && !flip) {
      setBookState('closing');
    } else {
      turnPage('next');
    }
  };

  return (
    <div className="catalogue">
      <div className="catalogue__heading">
        <div>
          <p>THE GIFT EDIT</p>
          <h3>Thoughtfully chosen. Beautifully remembered.</h3>
        </div>
        <span className="catalogue__brand">A COLLECTION BY INBA&apos;S</span>
      </div>

      <div
        className={`catalogue-book catalogue-book--${bookState}${flip ? ' is-turning' : ''}${isMobile ? ' is-mobile' : ''}`}
        tabIndex={0}
        onClick={handleBookClick}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        aria-label="Interactive gift catalogue. Click or swipe either side of the open book to turn pages, or use the arrow keys."
      >
        <div className="catalogue-book__cover" aria-hidden="true" />
        <button
          type="button"
          className="catalogue-book__front-cover"
          onClick={openBook}
          onAnimationEnd={handleCoverAnimationEnd}
          aria-label="Open the gift catalogue"
          tabIndex={bookState === 'closed' ? 0 : -1}
          aria-hidden={bookState !== 'closed'}
        >
          <span className="catalogue-book__cover-rule" />
          <span className="catalogue-book__cover-mark"><Gift size={34} strokeWidth={1.4} /></span>
          <span className="catalogue-book__cover-kicker">INBA&apos;S · MR &amp; MRS GIFTS</span>
          <span className="catalogue-book__cover-title">The Gift Edit</span>
          <span className="catalogue-book__cover-subtitle">A collection of thoughtful surprises</span>
          <span className="catalogue-book__cover-open"><BookOpen size={16} /> Click to open</span>
          <span className="catalogue-book__cover-sparkle"><Sparkles size={18} /></span>
          <span className="catalogue-book__cover-rule catalogue-book__cover-rule--bottom" />
        </button>
        <div className="catalogue-book__pages">
          <div className="catalogue-book__spine" aria-hidden="true" />
          <div className="catalogue-book__spread">
            {displayedProducts.map((product, index) => {
              const productIndex = visiblePageIndex + index;
              return (
                <ProductPage
                  key={product?.id ?? `blank-${productIndex}`}
                  product={product}
                  pageNumber={productIndex + 1}
                  isWishlisted={product ? wishlistIds.includes(product.id) : false}
                  onToggleWishlist={onToggleWishlist}
                  onAddToBag={onAddToBag}
                />
              );
            })}
          </div>

          {flip && (
            <div
              key={`${flip.direction}-${flip.targetIndex}`}
              className={`catalogue-flip-sheet catalogue-flip-sheet--${flip.direction}`}
              onAnimationEnd={handleAnimationEnd}
              aria-hidden="true"
            >
              <div className="catalogue-flip-sheet__face catalogue-flip-sheet__front">
                <ProductPage product={products[flip.frontIndex]} pageNumber={flip.frontIndex + 1} />
              </div>
              <div className="catalogue-flip-sheet__face catalogue-flip-sheet__back">
                <ProductPage
                  product={products[flip.backIndex]}
                  pageNumber={flip.backIndex + 1}
                  isWishlisted={wishlistIds.includes(products[flip.backIndex]?.id)}
                  onToggleWishlist={onToggleWishlist}
                  onAddToBag={onAddToBag}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="catalogue__controls">
        <button
          type="button"
          className="catalogue__nav-btn"
          onClick={() => turnPage('previous')}
          disabled={bookState !== 'open' || isAtStart || !!flip}
          aria-label="Previous page"
        >
          ← Previous
        </button>
        <span className="catalogue__page-count" aria-live="polite">{pageLabel}</span>
        <button
          type="button"
          className="catalogue__nav-btn"
          onClick={handleNext}
          disabled={isBookBusy || (bookState === 'open' && !!flip)}
          aria-label={bookState === 'closed' ? 'Open catalogue' : isAtEnd ? 'Explore gifts and close catalogue' : 'Next page'}
        >
          {bookState === 'closed' ? 'Open Book →' : isAtEnd ? 'Explore Gifts' : 'Next →'}
        </button>
      </div>
      <p className="catalogue__hint">
        {bookState === 'closed'
          ? 'Click the book cover to explore the collection'
          : isAtEnd
            ? 'End of the collection · click the left side to go back'
            : 'Click anywhere on the right side to continue · click the left side to go back'}
      </p>
    </div>
  );
}

export default ProductCatalogue;
