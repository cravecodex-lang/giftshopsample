import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

function CustomizedGiftDetail({ product, onClose }) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!product) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[70] h-dvh min-h-[500px] overflow-y-auto bg-[#fbf2ea] text-[#792b35]"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={product.title}
        >
          <div className="relative mx-auto flex h-full min-h-[500px] max-w-[1600px] flex-col px-5 pb-4 pt-24 sm:px-10 sm:pt-24 lg:px-14">
            <button
              type="button"
              onClick={onClose}
              className="absolute left-5 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-[#792b35]/30 bg-[#fbf2ea]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition hover:bg-white sm:left-10 sm:top-8"
              aria-label="Back to customized gifts"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to gifts</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-5 top-6 z-10 grid h-10 w-10 place-items-center rounded-full bg-[#f04b1c] text-white transition hover:scale-105 sm:right-10 sm:top-8"
              aria-label="Close product view"
            >
              <X size={18} />
            </button>

            <motion.h2
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.55 }}
              className="relative z-10 shrink-0 text-center font-display text-[clamp(2rem,8vw,7.5rem)] uppercase leading-[0.88] tracking-[-0.045em] text-[#f04b1c]"
            >
              {product.title}
            </motion.h2>

            <div className="relative flex min-h-0 flex-1 items-center justify-center py-3">
              <div className="pointer-events-none absolute bottom-0 left-1/2 h-[48vw] max-h-[440px] w-[75vw] max-w-[720px] -translate-x-1/2 rounded-[50%] bg-[#efcbbb]/35 blur-3xl" />
              <motion.img
                src={product.image}
                alt={product.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.7, delay: prefersReducedMotion ? 0 : 0.12 }}
                className="relative z-[1] h-full max-h-full w-full max-w-[680px] object-contain drop-shadow-[0_32px_30px_rgba(80,34,32,0.18)]"
              />
            </div>

            <div className="flex shrink-0 items-center justify-between border-t border-[#792b35]/15 pt-3 text-xs sm:text-sm">
              <span className="max-w-[42%] font-display text-base sm:text-xl">Made personal, made memorable.</span>
              <span className="text-right text-[9px] font-semibold uppercase tracking-[0.18em] sm:text-xs">
                Inba&apos;s Mr &amp; Mrs Gifts
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default CustomizedGiftDetail;
